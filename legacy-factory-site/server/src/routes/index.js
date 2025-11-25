/**
 * API Routes Index
 */

import express from 'express';
import authRoutes from './auth.js';
import surveyRoutes from './surveys.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/surveys', surveyRoutes);

export default router;
