const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/progressController');

router.use(protect);

// Student routes
router.post('/sync',                  ctrl.syncProgress);
router.get('/my',                     ctrl.getMyProgress);
router.get('/notifications',          ctrl.getNotifications);
router.put('/notifications/read',     ctrl.markAllRead);

// Teacher / Admin routes
router.get('/class',                  authorize('admin', 'teacher'), ctrl.getClassProgress);
router.get('/student/:studentId',     authorize('admin', 'teacher'), ctrl.getStudentDetail);
router.post('/student/:studentId/sync', authorize('admin', 'teacher'), ctrl.syncProgress);

module.exports = router;
