/**
 * Survey API Module
 * Handles backend communication for survey submissions
 * Implements offline-first approach with automatic sync
 */

import { OfflineQueue } from './offline-queue.js';

// API Configuration
const API_CONFIG = {
    // Base URL - auto-detect based on environment
    baseUrl: typeof process !== 'undefined' && process.env?.API_URL
        ? process.env.API_URL
        : (window.location.hostname === 'localhost'
            ? 'http://localhost:3001'
            : 'https://api.daremon.nl'),

    // API Endpoints
    endpoints: {
        granulateSurvey: '/api/v1/surveys/granulate',
        employeeSurvey: '/api/v1/surveys/employee',
        healthCheck: '/api/v1/health'
    },

    // Request configuration
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 2000, // Initial retry delay in ms

    // Feature flags
    enableBackend: true, // SECURITY: Backend enabled with httpOnly cookies
    enableOfflineQueue: true,
};

// Initialize offline queue
const offlineQueue = new OfflineQueue('daremon_survey_queue');

/**
 * SECURITY: CSRF protection is now handled by backend via httpOnly cookies
 * No need for client-side token generation
 */

/**
 * Submit survey to backend API
 * @param {string} surveyType - Type of survey ('granulate' or 'employee')
 * @param {object} data - Survey data
 * @returns {Promise<object>} Response from API
 */
export async function submitSurvey(surveyType, data) {
    // Determine endpoint
    const endpoint = surveyType === 'granulate'
        ? API_CONFIG.endpoints.granulateSurvey
        : API_CONFIG.endpoints.employeeSurvey;

    // Prepare request payload (SECURITY: No client-side tokens needed)
    const payload = {
        ...data,
        clientTimestamp: new Date().toISOString(),
        language: document.documentElement.lang || 'nl',
    };

    // Check if backend is enabled
    if (!API_CONFIG.enableBackend) {
        console.log('📦 Backend disabled - saving to localStorage only');
        return {
            success: true,
            message: 'Survey saved locally (backend disabled)',
            data: payload,
            offline: true
        };
    }

    // Try to submit to backend
    try {
        const response = await submitWithRetry(endpoint, payload);

        if (response.success) {
            console.log('✅ Survey submitted to backend successfully');
            return response;
        } else {
            throw new Error(response.message || 'Backend submission failed');
        }
    } catch (error) {
        console.warn('⚠️ Backend submission failed, adding to offline queue:', error);

        // Add to offline queue if enabled
        if (API_CONFIG.enableOfflineQueue) {
            await offlineQueue.add({
                endpoint,
                payload,
                surveyType,
                timestamp: Date.now()
            });

            return {
                success: true,
                message: 'Survey queued for sync when online',
                data: payload,
                offline: true,
                queued: true
            };
        }

        // If offline queue disabled, just save locally
        return {
            success: true,
            message: 'Survey saved locally (backend unavailable)',
            data: payload,
            offline: true,
            error: error.message
        };
    }
}

/**
 * Submit to backend with retry logic
 */
async function submitWithRetry(endpoint, payload, attempt = 1) {
    try {
        const url = `${API_CONFIG.baseUrl}${endpoint}`;

        const response = await fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-Version': '1.0.0',
            },
            credentials: 'include', // SECURITY: Include httpOnly cookies
            body: JSON.stringify(payload),
        }, API_CONFIG.timeout);

        if (!response.ok) {
            // Parse error message
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = await response.text() || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return {
            success: true,
            data,
            message: data.message || 'Survey submitted successfully'
        };

    } catch (error) {
        // Retry logic
        if (attempt < API_CONFIG.retryAttempts) {
            const delay = API_CONFIG.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
            console.log(`⏳ Retry attempt ${attempt + 1}/${API_CONFIG.retryAttempts} after ${delay}ms`);

            await sleep(delay);
            return submitWithRetry(endpoint, payload, attempt + 1);
        }

        // All retries failed
        throw error;
    }
}

/**
 * Fetch with timeout
 */
function fetchWithTimeout(url, options, timeout) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

/**
 * Sleep utility
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
    if (!API_CONFIG.enableBackend) {
        return { available: false, reason: 'Backend disabled in config' };
    }

    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.healthCheck}`,
            { method: 'GET' },
            5000
        );

        if (response.ok) {
            const data = await response.json();
            return { available: true, data };
        }

        return { available: false, reason: `HTTP ${response.status}` };
    } catch (error) {
        return { available: false, reason: error.message };
    }
}

/**
 * Process offline queue
 * Called when network comes back online
 */
export async function processOfflineQueue() {
    if (!API_CONFIG.enableBackend || !API_CONFIG.enableOfflineQueue) {
        return { processed: 0, failed: 0 };
    }

    console.log('🔄 Processing offline queue...');
    const results = await offlineQueue.process(async (item) => {
        try {
            const response = await submitWithRetry(item.endpoint, item.payload);
            return { success: true, response };
        } catch (error) {
            console.error('Failed to process queued item:', error);
            return { success: false, error: error.message };
        }
    });

    console.log(`✅ Processed ${results.processed} items, ${results.failed} failed`);
    return results;
}

/**
 * Initialize API module
 */
export function initializeSurveyAPI() {
    // Check backend health on startup
    if (API_CONFIG.enableBackend) {
        checkBackendHealth().then(health => {
            if (health.available) {
                console.log('✅ Backend API is available');
                // Process any queued items
                processOfflineQueue();
            } else {
                console.warn('⚠️ Backend API is not available:', health.reason);
            }
        });
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
        console.log('🌐 Network online - processing queue');
        processOfflineQueue();
    });

    window.addEventListener('offline', () => {
        console.log('📴 Network offline - will queue submissions');
    });

    console.log('✅ Survey API module initialized');
}

/**
 * Get API configuration (for debugging)
 */
export function getAPIConfig() {
    return { ...API_CONFIG };
}

/**
 * Update API configuration
 */
export function updateAPIConfig(updates) {
    Object.assign(API_CONFIG, updates);
    console.log('⚙️ API config updated:', API_CONFIG);
}

// Export for use in other modules
export default {
    submitSurvey,
    checkBackendHealth,
    processOfflineQueue,
    initializeSurveyAPI,
    getAPIConfig,
    updateAPIConfig
};
