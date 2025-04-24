const GoldPrice = require('../models/GoldPrice');
const axios = require('axios');

// @desc    Get latest gold price
// @route   GET /api/gold/price
// @access  Public
exports.getGoldPrice = async (req, res) => {
  try {
    // Get the latest gold price from the database
    let goldPrice = await GoldPrice.getLatestPrice();
    
    // If no data in database or data is older than 1 hour, fetch from API
    if (!goldPrice || isDataStale(goldPrice.timestamp)) {
      const newPrice = await fetchGoldPriceFromAPI();
      
      // Save new price to database
      goldPrice = await GoldPrice.create({
        priceUSD: newPrice.price,
        change24h: newPrice.change24h,
        changePercent24h: newPrice.changePercent24h,
        source: 'API'
      });
    }
    
    res.json({
      success: true,
      data: {
        price: goldPrice.priceUSD,
        change24h: goldPrice.change24h,
        changePercent24h: goldPrice.changePercent24h,
        timestamp: goldPrice.timestamp
      }
    });
  } catch (error) {
    console.error('Get gold price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gold price'
    });
  }
};

// @desc    Get historical gold prices
// @route   GET /api/gold/history
// @access  Public
exports.getGoldPriceHistory = async (req, res) => {
  try {
    // Get time period from query params (default to 30 days)
    const days = parseInt(req.query.days) || 30;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get historical data from database
    const priceHistory = await GoldPrice.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 });
    
    // If no data or insufficient data, generate mock data
    if (priceHistory.length < 5) {
      const mockData = generateMockGoldPriceHistory(days);
      return res.json({
        success: true,
        data: mockData,
        note: 'Using mock data as historical data is not available'
      });
    }
    
    // Format the data for the frontend
    const formattedData = priceHistory.map(item => ({
      price: item.priceUSD,
      date: item.timestamp
    }));
    
    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Get gold price history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gold price history'
    });
  }
};

// Helper function to check if data is stale (older than 1 hour)
const isDataStale = (timestamp) => {
  const currentTime = new Date();
  const dataTime = new Date(timestamp);
  const diffMs = currentTime - dataTime;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours > 1;
};

// Helper function to fetch gold price from external API
// In a real app, you would use a real gold price API
const fetchGoldPriceFromAPI = async () => {
  try {
    // Simulate API call with mock data
    // In production, this would be a real API call
    // const response = await axios.get('https://api.example.com/gold', {
    //   headers: { 'API-Key': process.env.GOLD_API_KEY }
    // });
    
    // For demo purposes, generate mock data
    const basePrice = 2000 + (Math.random() * 100 - 50); // Random price around $2000
    const change24h = Math.random() * 20 - 10; // Random change between -10 and +10
    const changePercent24h = (change24h / basePrice) * 100;
    
    return {
      price: parseFloat(basePrice.toFixed(2)),
      change24h: parseFloat(change24h.toFixed(2)),
      changePercent24h: parseFloat(changePercent24h.toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching gold price from API:', error);
    // Return default values if API call fails
    return {
      price: 2000,
      change24h: 0,
      changePercent24h: 0
    };
  }
};

// Helper function to generate mock historical gold price data
const generateMockGoldPriceHistory = (days) => {
  const data = [];
  const endDate = new Date();
  const startPrice = 1900 + Math.random() * 200; // Random starting price between $1900-$2100
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(endDate.getDate() - i);
    
    // Generate a somewhat realistic price movement
    const volatility = 0.5; // 0.5% daily volatility
    const randomChange = (Math.random() * 2 - 1) * volatility / 100;
    const previousPrice = i === days ? startPrice : data[data.length - 1].price;
    const newPrice = previousPrice * (1 + randomChange);
    
    data.push({
      date: date.toISOString(),
      price: parseFloat(newPrice.toFixed(2))
    });
  }
  
  return data;
}; 