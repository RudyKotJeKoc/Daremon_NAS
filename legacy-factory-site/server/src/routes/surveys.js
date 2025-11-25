/**
 * Survey Routes
 */

import express from 'express';
import {
    submitEmployeeSurvey,
    getEmployeeSurveyResults,
    submitGranulateSurvey,
    getGranulateSurveyResults
} from '../controllers/surveyController.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import {
    validateEmployeeSurvey,
    validateGranulateSurvey,
    checkValidation
} from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/surveys/employee
 * @desc    Submit employee survey
 * @access  Private (authenticated users) or Public with optional auth
 */
router.post(
    '/employee',
    optionalAuth, // Optional auth - allows both authenticated and anonymous submissions
    validateEmployeeSurvey,
    checkValidation,
    asyncHandler(submitEmployeeSurvey)
);

/**
 * @route   GET /api/surveys/employee/results
 * @desc    Get employee survey results
 * @access  Private (admin/manager only)
 */
router.get(
    '/employee/results',
    authenticateToken,
    requireRole('admin', 'manager'),
    asyncHandler(getEmployeeSurveyResults)
);

/**
 * @route   POST /api/surveys/granulate
 * @desc    Submit granulate survey
 * @access  Private or Public with optional auth
 */
router.post(
    '/granulate',
    optionalAuth,
    validateGranulateSurvey,
    checkValidation,
    asyncHandler(submitGranulateSurvey)
);

/**
 * @route   GET /api/surveys/granulate/results
 * @desc    Get granulate survey results
 * @access  Private (admin/manager only)
 */
router.get(
    '/granulate/results',
    authenticateToken,
    requireRole('admin', 'manager'),
    asyncHandler(getGranulateSurveyResults)
);

export default router;
