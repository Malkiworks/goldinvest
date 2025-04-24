const mongoose = require('mongoose');

const goldPriceSchema = new mongoose.Schema({
  priceUSD: {
    type: Number,
    required: true
  },
  change24h: {
    type: Number,
    default: 0
  },
  changePercent24h: {
    type: Number,
    default: 0
  },
  volume24h: {
    type: Number
  },
  marketCap: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'API'
  }
});

// Static method to get the latest gold price
goldPriceSchema.statics.getLatestPrice = async function() {
  return await this.findOne().sort({ timestamp: -1 }).limit(1);
};

// Index for faster queries
goldPriceSchema.index({ timestamp: -1 });

module.exports = mongoose.model('GoldPrice', goldPriceSchema); 