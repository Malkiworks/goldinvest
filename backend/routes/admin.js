const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin privileges
router.use(protect);
router.use(authorize('admin'));

// Admin routes
router.get('/users', getAllUsers);

module.exports = router; 