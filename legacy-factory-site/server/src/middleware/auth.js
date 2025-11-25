/**
 * Authentication Middleware
 * JWT verification and access control
 */

import { verifyAccessToken } from '../utils/jwt.js';
import db from '../config/database.js';

/**
 * Middleware to authenticate requests using JWT from httpOnly cookie
 */
export function authenticateToken(req, res, next) {
    try {
        // Get token from httpOnly cookie (not from Authorization header!)
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        // Verify token
        const payload = verifyAccessToken(token);

        // Check if user still exists and is active
        const user = db.prepare('SELECT id, username, email, role, is_active FROM users WHERE id = ?')
            .get(payload.userId);

        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                error: 'Account deactivated'
            });
        }

        // Attach user to request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Log access for audit
        logAuditEvent(req.user.id, 'ACCESS', req.path, req.ip, req.get('user-agent'), 'success');

        next();
    } catch (error) {
        if (error.message === 'Token expired') {
            return res.status(401).json({
                error: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(403).json({
            error: 'Invalid token'
        });
    }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            // Log unauthorized access attempt
            logAuditEvent(
                req.user.id,
                'UNAUTHORIZED_ACCESS',
                req.path,
                req.ip,
                req.get('user-agent'),
                'blocked',
                `Required role: ${allowedRoles.join(' or ')}, User role: ${req.user.role}`
            );

            return res.status(403).json({
                error: 'Insufficient permissions'
            });
        }

        next();
    };
}

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export function optionalAuth(req, res, next) {
    try {
        const token = req.cookies.access_token;

        if (token) {
            const payload = verifyAccessToken(token);
            const user = db.prepare('SELECT id, username, email, role, is_active FROM users WHERE id = ?')
                .get(payload.userId);

            if (user && user.is_active) {
                req.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            }
        }

        next();
    } catch (error) {
        // Token invalid or expired - continue without user
        next();
    }
}

/**
 * Log audit event
 */
function logAuditEvent(userId, action, resource, ipAddress, userAgent, status, details = null) {
    try {
        db.prepare(`
            INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status, details)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(userId, action, resource, ipAddress, userAgent, status, details);
    } catch (error) {
        // Log to console if database insert fails
        console.error('Failed to log audit event:', error);
    }
}

export default {
    authenticateToken,
    requireRole,
    optionalAuth
};
