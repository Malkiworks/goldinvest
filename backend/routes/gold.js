const express = require('express');
const router = express.Router();
const { getGoldPrice, getGoldPriceHistory } = require('../controllers/goldController');

// Get current gold price
router.get('/price', getGoldPrice);

// Get gold price history
router.get('/history', getGoldPriceHistory);

module.exports = router; 