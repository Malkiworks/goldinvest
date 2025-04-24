const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [100, 'Minimum investment amount is $100']
  },
  goldWeightOz: {
    type: Number,
    required: true
  },
  goldPriceAtPurchase: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'withdrawn', 'completed'],
    default: 'active'
  },
  withdrawalDate: {
    type: Date
  },
  investmentDate: {
    type: Date,
    default: Date.now
  },
  maturityDate: {
    type: Date,
    required: true
  },
  returnRate: {
    type: Number,
    default: 5.0 // Default annual return rate in percentage
  },
  transactionId: {
    type: String,
    unique: true
  },
  fees: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current value based on latest gold price
investmentSchema.virtual('currentValue').get(function() {
  // This would be calculated dynamically based on current gold price
  // For now, just returning a placeholder
  return this.goldWeightOz * 2000; // Assuming $2000 per oz
});

// Generate transaction ID
investmentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Investment', investmentSchema); 