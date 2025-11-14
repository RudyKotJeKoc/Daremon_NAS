/**
 * JWT Utilities
 * Secure token generation and validation
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION_MIN_32_CHARS';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'daremon-nas',
        audience: 'daremon-nas-client'
    });
}

/**
 * Generate refresh token (long-lived, cryptographically secure)
 */
export function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Verify access token
 */
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'daremon-nas',
            audience: 'daremon-nas-client'
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        throw error;
    }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token) {
    return jwt.decode(token);
}

/**
 * Get token expiration timestamp
 */
export function getTokenExpiration(expiresIn = JWT_EXPIRES_IN) {
    // Parse expiration string (e.g., '1h', '7d')
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return Date.now() + 3600000; // Default 1 hour

    const [, value, unit] = match;
    const multipliers = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000
    };

    return Date.now() + (parseInt(value) * multipliers[unit]);
}

/**
 * Get refresh token expiration
 */
export function getRefreshTokenExpiration() {
    return getTokenExpiration(JWT_REFRESH_EXPIRES_IN);
}

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    decodeToken,
    getTokenExpiration,
    getRefreshTokenExpiration
};
