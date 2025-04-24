const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'interest', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'paypal', 'crypto', 'system'],
    default: 'bank_transfer'
  },
  description: {
    type: String
  },
  referenceId: {
    type: String
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique reference ID
transactionSchema.pre('save', function(next) {
  if (!this.referenceId) {
    const prefix = this.type.charAt(0).toUpperCase();
    this.referenceId = prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema); 