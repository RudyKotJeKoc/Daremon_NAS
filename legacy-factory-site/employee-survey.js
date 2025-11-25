/**
 * Employee Survey System - Ankieta Zespołu
 * Handles employee survey form submission and results display
 */

import { submitSurvey } from './survey-api.js';
import { escapeHtml, generateSessionToken } from './sanitize.js';

const EMPLOYEE_SURVEY_STORAGE_KEY = 'daremon_employee_survey_responses';

// Initialize employee survey system
export function initializeEmployeeSurvey() {
    const form = document.getElementById('employee-survey-form');
    const resultsBtn = document.getElementById('employee-survey-results-btn');
    const closeResultsBtn = document.getElementById('close-employee-results-btn');

    if (!form) {
        console.warn('Employee survey form not found');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', handleEmployeeSurveySubmit);

    // Handle results button
    if (resultsBtn) {
        resultsBtn.addEventListener('click', showEmployeeSurveyResults);
    }

    // Handle close results button
    if (closeResultsBtn) {
        closeResultsBtn.addEventListener('click', hideEmployeeSurveyResults);
    }

    console.log('✅ System ankiety pracowniczej zainicjalizowany');
}

/**
 * Handle employee survey form submission
 */
async function handleEmployeeSurveySubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Disable submit button
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Verzenden...';
    }

    const formData = new FormData(form);

    // Collect form data - simplified
    const response = {
        timestamp: new Date().toISOString(),
        sessionToken: generateSessionToken(),
        name: formData.get('name') || 'Anoniem',
        teamContinuation: formData.get('team-continuation'),
        ideas: formData.get('ideas') || ''
    };

    // Validate required field
    if (!response.teamContinuation) {
        showEmployeeValidationError('Selecteer een antwoord');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '📤 Verzenden';
        }
        return;
    }

    try {
        // Submit to backend API
        const result = await submitSurvey('employee', response);

        // Save to localStorage regardless of backend status
        saveEmployeeSurveyResponse(response);

        // Show appropriate success message
        if (result.offline) {
            if (result.queued) {
                showEmployeeStatusMessage('✅ Feedback opgeslagen', 'info');
            } else {
                showEmployeeStatusMessage('✅ Lokaal opgeslagen', 'warning');
            }
        } else {
            showEmployeeStatusMessage('✅ Feedback verzonden!', 'success');
        }

        // Show default success message
        showEmployeeSuccessMessage();

        // Reset form
        form.reset();

        // Scroll to success message
        document.getElementById('employee-survey-success')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    } catch (error) {
        console.error('Survey submission error:', error);

        // Save locally even if backend fails
        saveEmployeeSurveyResponse(response);

        // Show error but confirm local save
        showEmployeeValidationError('Verzending mislukt, maar lokaal opgeslagen. Probeer later opnieuw.');

    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '📤 Verzenden';
        }
    }
}

/**
 * Show validation error
 */
function showEmployeeValidationError(message) {
    let errorDiv = document.querySelector('.employee-validation-error');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'employee-validation-error';
        errorDiv.style.cssText = `
            background-color: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.5);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            color: #ef4444;
            font-weight: 600;
        `;

        const form = document.getElementById('employee-survey-form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    errorDiv.textContent = `⚠️ ${message}`;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Show status message
 */
function showEmployeeStatusMessage(message, type = 'success') {
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.5)', color: '#10b981' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.5)', color: '#3b82f6' },
        warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.5)', color: '#f59e0b' }
    };

    const style = colors[type] || colors.success;

    let messageDiv = document.querySelector('.employee-status-message');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'employee-status-message';

        const form = document.getElementById('employee-survey-form');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
        }
    }

    messageDiv.style.cssText = `
        background-color: ${style.bg};
        border: 2px solid ${style.border};
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        color: ${style.color};
        font-weight: 600;
    `;

    messageDiv.textContent = message;

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Save employee survey response to localStorage
 */
function saveEmployeeSurveyResponse(response) {
    try {
        const responses = getEmployeeSurveyResponses();
        responses.push(response);
        localStorage.setItem(EMPLOYEE_SURVEY_STORAGE_KEY, JSON.stringify(responses));
        console.log('✅ Odpowiedź ankiety pracowniczej zapisana');
    } catch (error) {
        console.error('❌ Błąd zapisywania odpowiedzi:', error);
        alert('Nie udało się zapisać ankiety. Spróbuj ponownie.');
    }
}

/**
 * Get all employee survey responses from localStorage
 */
function getEmployeeSurveyResponses() {
    try {
        const data = localStorage.getItem(EMPLOYEE_SURVEY_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Błąd odczytu odpowiedzi:', error);
        return [];
    }
}

/**
 * Show success message
 */
function showEmployeeSuccessMessage() {
    const successMsg = document.getElementById('employee-survey-success');
    const form = document.getElementById('employee-survey-form');

    if (successMsg && form) {
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');

        // Hide success message and show form again after 5 seconds
        setTimeout(() => {
            successMsg.classList.add('hidden');
            form.classList.remove('hidden');
        }, 5000);
    }
}

/**
 * Show employee survey results
 */
function showEmployeeSurveyResults() {
    const responses = getEmployeeSurveyResponses();
    const resultsDiv = document.getElementById('employee-survey-results');
    const contentDiv = document.getElementById('employee-survey-results-content');

    if (!resultsDiv || !contentDiv) return;

    if (responses.length === 0) {
        contentDiv.innerHTML = '<p class="no-results">Brak odpowiedzi. Bądź pierwszy!</p>';
    } else {
        contentDiv.innerHTML = generateEmployeeResultsHTML(responses);
    }

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Hide employee survey results
 */
function hideEmployeeSurveyResults() {
    const resultsDiv = document.getElementById('employee-survey-results');
    if (resultsDiv) {
        resultsDiv.classList.add('hidden');
    }
}

/**
 * Generate HTML for results display - simplified
 */
function generateEmployeeResultsHTML(responses) {
    const total = responses.length;

    // Count team continuation responses
    const continuationCounts = {
        yes: responses.filter(r => r.teamContinuation === 'yes').length,
        maybe: responses.filter(r => r.teamContinuation === 'maybe').length,
        no: responses.filter(r => r.teamContinuation === 'no').length
    };

    let html = `
        <div class="results-summary">
            <p class="total-responses">Totaal: <strong>${total}</strong></p>

            <div class="stat-section">
                <h4>Radio ETS blijven gebruiken?</h4>
                <div class="stat-bar">
                    <div class="stat-item">
                        <span class="stat-label">Ja</span>
                        <div class="stat-progress">
                            <div class="stat-fill yes-fill" style="width: ${(continuationCounts.yes / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${continuationCounts.yes} (${(continuationCounts.yes / total * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Misschien</span>
                        <div class="stat-progress">
                            <div class="stat-fill maybe-fill" style="width: ${(continuationCounts.maybe / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${continuationCounts.maybe} (${(continuationCounts.maybe / total * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Nee</span>
                        <div class="stat-progress">
                            <div class="stat-fill no-fill" style="width: ${(continuationCounts.no / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${continuationCounts.no} (${(continuationCounts.no / total * 100).toFixed(1)}%)</span>
                    </div>
                </div>
            </div>

            <div class="stat-section">
                <h4>💡 Opmerkingen:</h4>
                <div class="ideas-list">
                    ${responses
                        .filter(r => r.ideas && r.ideas.trim())
                        .map((r, idx) => `
                            <div class="idea-item">
                                <strong>${escapeHtml(r.name)}</strong>
                                <p>${escapeHtml(r.ideas)}</p>
                            </div>
                        `).join('') || '<p class="no-ideas">Geen opmerkingen</p>'}
                </div>
            </div>
        </div>
    `;

    return html;
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.initializeEmployeeSurvey = initializeEmployeeSurvey;
}

export default { initializeEmployeeSurvey };
