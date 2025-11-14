/**
 * Validation Utilities
 * Input sanitization and validation
 */

/**
 * Sanitize text input
 */
export function sanitizeText(text, maxLength = 1000) {
    if (!text) return '';

    let sanitized = String(text).trim();

    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
}

/**
 * Validate username
 */
export function validateUsername(username) {
    const sanitized = sanitizeText(username, 50);

    if (sanitized.length < 3) {
        return {
            valid: false,
            error: 'Username must be at least 3 characters'
        };
    }

    if (sanitized.length > 50) {
        return {
            valid: false,
            error: 'Username must be at most 50 characters'
        };
    }

    // Allow alphanumeric, underscore, hyphen
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(sanitized)) {
        return {
            valid: false,
            error: 'Username can only contain letters, numbers, underscores, and hyphens'
        };
    }

    return { valid: true, value: sanitized };
}

/**
 * Validate email
 */
export function validateEmail(email) {
    const sanitized = sanitizeText(email, 255).toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
        return {
            valid: false,
            error: 'Invalid email format'
        };
    }

    return { valid: true, value: sanitized };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
    if (!password || password.length < 8) {
        return {
            valid: false,
            error: 'Password must be at least 8 characters'
        };
    }

    if (password.length > 128) {
        return {
            valid: false,
            error: 'Password must be at most 128 characters'
        };
    }

    // Require at least one uppercase, one lowercase, one number
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one uppercase letter'
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one lowercase letter'
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one number'
        };
    }

    return { valid: true };
}

/**
 * Validate array of allowed values
 */
export function validateSelect(value, allowedValues) {
    if (!allowedValues.includes(value)) {
        return {
            valid: false,
            error: 'Invalid value'
        };
    }

    return { valid: true, value };
}

/**
 * Validate name
 */
export function validateName(name) {
    const sanitized = sanitizeText(name, 100);

    if (sanitized.length < 2) {
        return {
            valid: false,
            error: 'Name must be at least 2 characters'
        };
    }

    // Allow letters, spaces, hyphens, apostrophes, and accented characters
    const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/;
    if (!nameRegex.test(sanitized)) {
        return {
            valid: false,
            error: 'Name contains invalid characters'
        };
    }

    return { valid: true, value: sanitized };
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
    if (!text) return '';

    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default {
    sanitizeText,
    validateUsername,
    validateEmail,
    validatePassword,
    validateSelect,
    validateName,
    escapeHtml
};
