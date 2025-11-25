/**
 * Request Validation Middleware
 * Using express-validator for robust input validation
 */

import { body, validationResult } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be 3-50 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be 8-128 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

/**
 * Validation rules for employee survey
 */
export const validateEmployeeSurvey = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be 2-100 characters')
        .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/)
        .withMessage('Name contains invalid characters'),

    body('teamContinuation')
        .isIn(['yes', 'maybe', 'no'])
        .withMessage('Invalid team continuation value'),

    body('daremonFeatures')
        .optional()
        .isArray()
        .withMessage('Daremon features must be an array'),

    body('daremonFeatures.*')
        .optional()
        .isIn(['radio', 'visualizer', 'surveys', 'messaging', 'themes', 'ratings'])
        .withMessage('Invalid feature value'),

    body('newFeatures')
        .optional()
        .isArray()
        .withMessage('New features must be an array'),

    body('newFeaturesOther')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Other features must be max 500 characters'),

    body('helpAreas')
        .optional()
        .isArray()
        .withMessage('Help areas must be an array'),

    body('ideas')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Ideas must be max 1000 characters')
];

/**
 * Validation rules for granulate survey
 */
export const validateGranulateSurvey = [
    body('experience')
        .notEmpty()
        .withMessage('Experience is required'),

    body('factory')
        .notEmpty()
        .withMessage('Factory is required'),

    body('role')
        .notEmpty()
        .withMessage('Role is required'),

    body('improvements')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Improvements must be max 2000 characters'),

    body('additionalComments')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Additional comments must be max 2000 characters')
];

/**
 * Middleware to check validation results
 */
export function checkValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
}

export default {
    validateRegistration,
    validateLogin,
    validateEmployeeSurvey,
    validateGranulateSurvey,
    checkValidation
};
