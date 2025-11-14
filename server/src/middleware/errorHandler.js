/**
 * Error Handling Middleware
 * Centralized error handling with security-aware logging
 */

/**
 * Global error handler
 * Returns generic messages to clients, logs details internally
 */
export function errorHandler(err, req, res, next) {
    // Log error details internally (never expose to client)
    console.error('Error occurred:', {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        user: req.user?.id
    });

    // Determine status code
    const statusCode = err.statusCode || err.status || 500;

    // Generic error messages for security
    const userMessages = {
        400: 'Invalid request',
        401: 'Authentication required',
        403: 'Access denied',
        404: 'Resource not found',
        429: 'Too many requests. Please try again later',
        500: 'An error occurred. Please try again later',
        503: 'Service temporarily unavailable'
    };

    // In development, provide more details
    const response = {
        error: userMessages[statusCode] || 'An error occurred',
        ...(process.env.NODE_ENV === 'development' && {
            message: err.message,
            stack: err.stack
        })
    };

    res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Endpoint not found'
    });
}

/**
 * Async route handler wrapper
 * Catches errors from async functions and passes to error handler
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export default {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
