const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { exportTasksReport, exportUsersReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/export/tasks', protect, adminOnly, exportTasksReport); // Export all tasks as Excel/pdf
router.get('/export/users', protect, adminOnly, exportUsersReport); // Export all users as Excel/pdf

module.exports = router;