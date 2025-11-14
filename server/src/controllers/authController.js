/**
 * Authentication Controller
 * Handles user registration, login, logout, token refresh
 */

import bcrypt from 'bcrypt';
import db from '../config/database.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    getRefreshTokenExpiration
} from '../utils/jwt.js';
import { validateUsername, validateEmail, validatePassword } from '../utils/validation.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'CHANGE_THIS_IN_PRODUCTION';

/**
 * Register new user
 */
export async function register(req, res, next) {
    try {
        const { username, email, password } = req.body;

        // Additional validation (on top of express-validator)
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            return res.status(400).json({ error: usernameValidation.error });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ error: emailValidation.error });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.error });
        }

        // Check if user already exists
        const existingUser = db.prepare(
            'SELECT id FROM users WHERE username = ? OR email = ?'
        ).get(usernameValidation.value, emailValidation.value);

        if (existingUser) {
            return res.status(409).json({
                error: 'Username or email already exists'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Create user
        const result = db.prepare(`
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `).run(usernameValidation.value, emailValidation.value, passwordHash, 'user');

        const userId = result.lastInsertRowid;

        // Log audit event
        db.prepare(`
            INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(userId, 'REGISTER', '/api/auth/register', req.ip, req.get('user-agent'), 'success');

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: userId,
                username: usernameValidation.value,
                email: emailValidation.value
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Login user
 */
export async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // Find user
        const user = db.prepare(
            'SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = ?'
        ).get(username);

        if (!user) {
            // Generic error for security (don't reveal if user exists)
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                error: 'Account deactivated'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            // Log failed login attempt
            db.prepare(`
                INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status, details)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(user.id, 'LOGIN_FAILED', '/api/auth/login', req.ip, req.get('user-agent'), 'failed', 'Invalid password');

            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            username: user.username,
            role: user.role
        });

        const refreshToken = generateRefreshToken();
        const refreshTokenExpiry = new Date(getRefreshTokenExpiration());

        // Store refresh token in database
        db.prepare(`
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES (?, ?, ?)
        `).run(user.id, refreshToken, refreshTokenExpiry.toISOString());

        // Update last login
        db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

        // Log successful login
        db.prepare(`
            INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(user.id, 'LOGIN_SUCCESS', '/api/auth/login', req.ip, req.get('user-agent'), 'success');

        // Set httpOnly cookies (SECURE - not accessible to JavaScript)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 3600000 // 7 days
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Logout user
 */
export async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (refreshToken) {
            // Remove refresh token from database
            db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);
        }

        // Log logout
        if (req.user) {
            db.prepare(`
                INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(req.user.id, 'LOGOUT', '/api/auth/logout', req.ip, req.get('user-agent'), 'success');
        }

        // Clear cookies
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Refresh access token
 */
export async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                error: 'Refresh token required'
            });
        }

        // Find refresh token in database
        const tokenRecord = db.prepare(`
            SELECT rt.*, u.id, u.username, u.role, u.is_active
            FROM refresh_tokens rt
            JOIN users u ON rt.user_id = u.id
            WHERE rt.token = ?
        `).get(refreshToken);

        if (!tokenRecord) {
            return res.status(403).json({
                error: 'Invalid refresh token'
            });
        }

        // Check if token expired
        if (new Date(tokenRecord.expires_at) < new Date()) {
            // Remove expired token
            db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);

            return res.status(403).json({
                error: 'Refresh token expired'
            });
        }

        // Check if user is active
        if (!tokenRecord.is_active) {
            return res.status(403).json({
                error: 'Account deactivated'
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({
            userId: tokenRecord.id,
            username: tokenRecord.username,
            role: tokenRecord.role
        });

        // Set new access token cookie
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.json({
            success: true,
            message: 'Token refreshed'
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get current user
 */
export function getCurrentUser(req, res) {
    res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
}

export default {
    register,
    login,
    logout,
    refresh,
    getCurrentUser
};
