const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');
const fs = require('fs');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// File Upload Middleware
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const userDir = path.join(uploadDir, 'kyc', req.user?.id?.toString() || 'temp');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function(req, file, cb) {
    // Use original filename but sanitize it
    const fileExt = path.extname(file.originalname);
    const fileName = file.fieldname;
    cb(null, `${fileName}${fileExt}`);
  }
});

const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/gold', require('./routes/gold'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ msg: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 