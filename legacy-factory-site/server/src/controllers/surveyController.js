/**
 * Survey Controller
 * Handles survey submissions and results retrieval
 */

import db from '../config/database.js';
import { sanitizeText } from '../utils/validation.js';

/**
 * Submit employee survey
 */
export async function submitEmployeeSurvey(req, res, next) {
    try {
        const {
            name,
            teamContinuation,
            daremonFeatures,
            newFeatures,
            newFeaturesOther,
            helpAreas,
            ideas
        } = req.body;

        // Sanitize text inputs
        const sanitizedName = sanitizeText(name, 100);
        const sanitizedNewFeaturesOther = sanitizeText(newFeaturesOther, 500);
        const sanitizedIdeas = sanitizeText(ideas, 1000);

        // Convert arrays to JSON strings
        const daremonFeaturesJson = JSON.stringify(daremonFeatures || []);
        const newFeaturesJson = JSON.stringify(newFeatures || []);
        const helpAreasJson = JSON.stringify(helpAreas || []);

        // Insert survey
        const result = db.prepare(`
            INSERT INTO employee_surveys (
                user_id,
                name,
                team_continuation,
                daremon_features,
                new_features,
                new_features_other,
                help_areas,
                ideas,
                ip_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            req.user?.id || null,
            sanitizedName,
            teamContinuation,
            daremonFeaturesJson,
            newFeaturesJson,
            sanitizedNewFeaturesOther,
            helpAreasJson,
            sanitizedIdeas,
            req.ip
        );

        // Log audit event
        db.prepare(`
            INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            req.user?.id || null,
            'SURVEY_SUBMIT',
            '/api/surveys/employee',
            req.ip,
            req.get('user-agent'),
            'success'
        );

        res.status(201).json({
            success: true,
            message: 'Survey submitted successfully',
            surveyId: result.lastInsertRowid
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get employee survey results (admin/manager only)
 */
export function getEmployeeSurveyResults(req, res, next) {
    try {
        // Fetch all surveys
        const surveys = db.prepare(`
            SELECT
                id,
                name,
                team_continuation,
                daremon_features,
                new_features,
                new_features_other,
                help_areas,
                ideas,
                created_at
            FROM employee_surveys
            ORDER BY created_at DESC
        `).all();

        // Parse JSON fields
        const parsedSurveys = surveys.map(survey => ({
            ...survey,
            daremonFeatures: JSON.parse(survey.daremon_features || '[]'),
            newFeatures: JSON.parse(survey.new_features || '[]'),
            helpAreas: JSON.parse(survey.help_areas || '[]')
        }));

        res.json({
            success: true,
            total: parsedSurveys.length,
            surveys: parsedSurveys
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Submit granulate survey
 */
export async function submitGranulateSurvey(req, res, next) {
    try {
        const {
            experience,
            factory,
            factoryOther,
            role,
            roleOther,
            interruptionFrequency,
            systemProblems,
            systemProblemsOther,
            interruptionDuration,
            sensorsFunction,
            systemDiagnosis,
            alarmResolution,
            supplyContinuity,
            bufferNeed,
            deliveryErgonomics,
            trainingReceived,
            operationConfidence,
            helpNeeded,
            helpNeededOther,
            improvements,
            harmfulBehavior,
            harmfulBehaviorDetail,
            stressLevel,
            additionalComments
        } = req.body;

        // Sanitize text inputs
        const sanitizedFactoryOther = sanitizeText(factoryOther, 200);
        const sanitizedRoleOther = sanitizeText(roleOther, 200);
        const sanitizedSystemProblemsOther = sanitizeText(systemProblemsOther, 500);
        const sanitizedHelpNeededOther = sanitizeText(helpNeededOther, 500);
        const sanitizedImprovements = sanitizeText(improvements, 2000);
        const sanitizedHarmfulBehaviorDetail = sanitizeText(harmfulBehaviorDetail, 1000);
        const sanitizedAdditionalComments = sanitizeText(additionalComments, 2000);

        // Convert arrays to JSON
        const systemProblemsJson = JSON.stringify(systemProblems || []);
        const helpNeededJson = JSON.stringify(helpNeeded || []);

        // Insert survey
        const result = db.prepare(`
            INSERT INTO granulate_surveys (
                user_id,
                experience,
                factory,
                factory_other,
                role,
                role_other,
                interruption_frequency,
                system_problems,
                system_problems_other,
                interruption_duration,
                sensors_function,
                system_diagnosis,
                alarm_resolution,
                supply_continuity,
                buffer_need,
                delivery_ergonomics,
                training_received,
                operation_confidence,
                help_needed,
                help_needed_other,
                improvements,
                harmful_behavior,
                harmful_behavior_detail,
                stress_level,
                additional_comments,
                ip_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            req.user?.id || null,
            experience,
            factory,
            sanitizedFactoryOther,
            role,
            sanitizedRoleOther,
            interruptionFrequency,
            systemProblemsJson,
            sanitizedSystemProblemsOther,
            interruptionDuration,
            sensorsFunction,
            systemDiagnosis,
            alarmResolution,
            supplyContinuity,
            bufferNeed,
            deliveryErgonomics,
            trainingReceived,
            operationConfidence,
            helpNeededJson,
            sanitizedHelpNeededOther,
            sanitizedImprovements,
            harmfulBehavior,
            sanitizedHarmfulBehaviorDetail,
            stressLevel,
            sanitizedAdditionalComments,
            req.ip
        );

        // Log audit event
        db.prepare(`
            INSERT INTO audit_log (user_id, action, resource, ip_address, user_agent, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            req.user?.id || null,
            'SURVEY_SUBMIT',
            '/api/surveys/granulate',
            req.ip,
            req.get('user-agent'),
            'success'
        );

        res.status(201).json({
            success: true,
            message: 'Survey submitted successfully',
            surveyId: result.lastInsertRowid
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get granulate survey results (admin/manager only)
 */
export function getGranulateSurveyResults(req, res, next) {
    try {
        // Fetch all surveys
        const surveys = db.prepare(`
            SELECT *
            FROM granulate_surveys
            ORDER BY created_at DESC
        `).all();

        // Parse JSON fields
        const parsedSurveys = surveys.map(survey => ({
            ...survey,
            systemProblems: JSON.parse(survey.system_problems || '[]'),
            helpNeeded: JSON.parse(survey.help_needed || '[]')
        }));

        res.json({
            success: true,
            total: parsedSurveys.length,
            surveys: parsedSurveys
        });
    } catch (error) {
        next(error);
    }
}

export default {
    submitEmployeeSurvey,
    getEmployeeSurveyResults,
    submitGranulateSurvey,
    getGranulateSurveyResults
};
