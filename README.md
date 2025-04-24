# Gold Investment Platform

A full-stack application for investing in gold, built with Node.js, Express, MongoDB, and React.

## Features

- User authentication and authorization
- KYC verification for users
- Real-time gold price tracking
- Investment portfolio management
- Transaction history
- Admin dashboard for user management

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Bootstrap, Chart.js
- **Authentication**: JWT, bcrypt
- **API**: Gold price data API integration

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/goldInvest
   JWT_SECRET=your_jwt_secret_key_here
   GOLD_API_KEY=your_gold_api_key_here
   ```
4. Run the application:
   ```
   npm run dev
   ```

## Project Structure

```
├── backend/           # Express server
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Mongoose models
│   └── routes/        # API routes
├── frontend/          # React client
│   ├── public/        # Static files
│   └── src/           # React source files
│       ├── components/# Reusable components
│       ├── pages/     # Page components
│       └── assets/    # Images, styles, etc.
└── package.json       # Project metadata and scripts
```

## API Endpoints

- **Auth**: `/api/auth`
  - POST `/register` - Register a new user
  - POST `/login` - Login user
  - GET `/me` - Get current user

- **Investments**: `/api/investments`
  - POST `/` - Create new investment
  - GET `/` - Get all user investments
  - GET `/:id` - Get single investment
  - PUT `/:id/withdraw` - Withdraw investment

- **Gold**: `/api/gold`
  - GET `/price` - Get current gold price
  - GET `/history` - Get gold price history 