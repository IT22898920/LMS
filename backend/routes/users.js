const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, toggleStatus, getStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/', protect, authorize('admin', 'teacher'), getUsers);
router.get('/:id', protect, getUser);
router.post('/', protect, authorize('admin'), createUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
