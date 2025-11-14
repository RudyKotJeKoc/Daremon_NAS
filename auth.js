/**
 * Frontend Authentication Module
 * Handles authentication using httpOnly cookies (SECURE)
 * Replaces localStorage-based auth for security
 */

const AUTH_CONFIG = {
    apiBaseUrl: typeof process !== 'undefined' && process.env?.API_URL
        ? process.env.API_URL
        : (window.location.hostname === 'localhost'
            ? 'http://localhost:3001'
            : 'https://api.daremon.nl'),

    endpoints: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login',
        logout: '/api/v1/auth/logout',
        refresh: '/api/v1/auth/refresh',
        me: '/api/v1/auth/me'
    }
};

/**
 * AuthService - Main authentication service
 */
export class AuthService {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
    }

    /**
     * Register new user
     */
    async register(username, email, password) {
        try {
            const response = await fetch(
                `${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.register}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return {
                success: true,
                user: data.user,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Login user
     * Sets httpOnly cookies automatically
     */
    async login(username, password) {
        try {
            const response = await fetch(
                `${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.login}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // IMPORTANT: Include cookies
                    body: JSON.stringify({ username, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            this.user = data.user;
            this.isAuthenticated = true;

            // Dispatch custom event for app to listen to
            window.dispatchEvent(new CustomEvent('auth:login', {
                detail: { user: data.user }
            }));

            return {
                success: true,
                user: data.user,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Logout user
     * Clears httpOnly cookies
     */
    async logout() {
        try {
            const response = await fetch(
                `${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.logout}`,
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            const data = await response.json();

            this.user = null;
            this.isAuthenticated = false;

            // Dispatch logout event
            window.dispatchEvent(new CustomEvent('auth:logout'));

            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            // Even if request fails, clear local state
            this.user = null;
            this.isAuthenticated = false;

            window.dispatchEvent(new CustomEvent('auth:logout'));

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Refresh access token
     * Automatically called when token expires
     */
    async refreshToken() {
        try {
            const response = await fetch(
                `${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.refresh}`,
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Token refresh failed');
            }

            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            // Refresh failed - user needs to login again
            this.user = null;
            this.isAuthenticated = false;

            window.dispatchEvent(new CustomEvent('auth:token-expired'));

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get current user
     * Verifies authentication with backend
     */
    async getCurrentUser() {
        try {
            const response = await fetch(
                `${AUTH_CONFIG.apiBaseUrl}${AUTH_CONFIG.endpoints.me}`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                // Not authenticated
                this.user = null;
                this.isAuthenticated = false;
                return null;
            }

            const data = await response.json();

            this.user = data.user;
            this.isAuthenticated = true;

            return data.user;
        } catch (error) {
            this.user = null;
            this.isAuthenticated = false;
            return null;
        }
    }

    /**
     * Make authenticated API request
     * Automatically includes cookies and handles token refresh
     */
    async fetch(url, options = {}) {
        try {
            // Add credentials to include httpOnly cookies
            const response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            // Check if token expired
            if (response.status === 401) {
                const data = await response.json();

                if (data.code === 'TOKEN_EXPIRED') {
                    // Try to refresh token
                    const refreshResult = await this.refreshToken();

                    if (refreshResult.success) {
                        // Retry original request with new token
                        return await fetch(url, {
                            ...options,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                ...options.headers
                            }
                        });
                    } else {
                        // Refresh failed - redirect to login
                        window.dispatchEvent(new CustomEvent('auth:token-expired'));
                        throw new Error('Session expired. Please login again.');
                    }
                }
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if user is authenticated
     * Returns cached value - call getCurrentUser() for server verification
     */
    isLoggedIn() {
        return this.isAuthenticated;
    }

    /**
     * Get cached user
     * Call getCurrentUser() for fresh data
     */
    getUser() {
        return this.user;
    }

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        return this.user && this.user.role === role;
    }

    /**
     * Initialize auth service
     * Checks if user is authenticated on page load
     */
    async initialize() {
        await this.getCurrentUser();
    }
}

// Create singleton instance
const authService = new AuthService();

// Auto-initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        authService.initialize().catch(err => {
            console.error('Failed to initialize auth:', err);
        });
    });

    // Make globally available
    window.authService = authService;
}

export default authService;
