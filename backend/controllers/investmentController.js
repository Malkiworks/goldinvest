const Investment = require('../models/Investment');
const GoldPrice = require('../models/GoldPrice');
const Transaction = require('../models/Transaction');

// @desc    Create new investment
// @route   POST /api/investments
// @access  Private
exports.createInvestment = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validate investment amount
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum investment amount is $100'
      });
    }

    // Get current gold price
    let goldPrice = await GoldPrice.getLatestPrice();
    
    // If no gold price in DB, use default (would be fetched from API in production)
    if (!goldPrice) {
      goldPrice = { priceUSD: 2000 }; // Default gold price
    }
    
    // Calculate gold weight in ounces based on investment amount
    const goldWeightOz = amount / goldPrice.priceUSD;
    
    // Set maturity date to 1 year from now
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + 1);
    
    // Create investment
    const investment = await Investment.create({
      user: req.user.id,
      amount,
      goldWeightOz,
      goldPriceAtPurchase: goldPrice.priceUSD,
      maturityDate,
      status: 'active'
    });
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      investment: investment._id,
      type: 'deposit',
      amount,
      status: 'completed',
      description: 'Investment deposit'
    });
    
    res.status(201).json({
      success: true,
      data: investment
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all investments for user
// @route   GET /api/investments
// @access  Private
exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });
    
    res.json({
      success: true,
      count: investments.length,
      data: investments
    });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single investment
// @route   GET /api/investments/:id
// @access  Private
exports.getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    // Check if the investment belongs to the user
    if (investment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this investment'
      });
    }
    
    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Withdraw investment
// @route   PUT /api/investments/:id/withdraw
// @access  Private
exports.withdrawInvestment = async (req, res) => {
  try {
    let investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    // Check if the investment belongs to the user
    if (investment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this investment'
      });
    }
    
    // Check if investment is already withdrawn
    if (investment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Investment is already ${investment.status}`
      });
    }
    
    // Get current gold price
    let goldPrice = await GoldPrice.getLatestPrice();
    
    // If no gold price in DB, use default (would be fetched from API in production)
    if (!goldPrice) {
      goldPrice = { priceUSD: 2000 }; // Default gold price
    }
    
    // Calculate current value based on gold weight and current price
    const currentValue = investment.goldWeightOz * goldPrice.priceUSD;
    
    // Update investment status
    investment.status = 'withdrawn';
    investment.withdrawalDate = Date.now();
    await investment.save();
    
    // Create withdrawal transaction
    await Transaction.create({
      user: req.user.id,
      investment: investment._id,
      type: 'withdrawal',
      amount: currentValue,
      status: 'completed',
      description: 'Investment withdrawal'
    });
    
    res.json({
      success: true,
      data: investment,
      withdrawalAmount: currentValue
    });
  } catch (error) {
    console.error('Withdraw investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 