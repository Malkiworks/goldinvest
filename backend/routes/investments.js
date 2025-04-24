const express = require('express');
const router = express.Router();
const { 
  createInvestment, 
  getInvestments, 
  getInvestment, 
  withdrawInvestment 
} = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .post(createInvestment)
  .get(getInvestments);

router.route('/:id')
  .get(getInvestment);

router.route('/:id/withdraw')
  .put(withdrawInvestment);

module.exports = router; 