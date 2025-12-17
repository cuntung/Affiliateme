const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth');

router.get('/overview', authMiddleware, analyticsController.getOverview);
router.get('/links/:id/stats', authMiddleware, analyticsController.getLinkStats);

module.exports = router;
