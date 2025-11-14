/**
 * Authentication Routes
 */

import express from 'express';
import {
    register,
    login,
    logout,
    refresh,
    getCurrentUser
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
    validateRegistration,
    validateLogin,
    checkValidation
} from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
    '/register',
    validateRegistration,
    checkValidation,
    asyncHandler(register)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    validateLogin,
    checkValidation,
    asyncHandler(login)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
    '/logout',
    asyncHandler(logout)
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token in cookie)
 */
router.post(
    '/refresh',
    asyncHandler(refresh)
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
    '/me',
    authenticateToken,
    getCurrentUser
);

export default router;
