import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const portfolioPerformanceData = [
  { date: 'Jan', value: 1000 },
  { date: 'Feb', value: 1050 },
  { date: 'Mar', value: 1100 },
  { date: 'Apr', value: 1075 },
  { date: 'May', value: 1150 },
  { date: 'Jun', value: 1200 },
  { date: 'Jul', value: 1250 },
  { date: 'Aug', value: 1300 },
  { date: 'Sep', value: 1350 },
  { date: 'Oct', value: 1400 },
  { date: 'Nov', value: 1450 },
  { date: 'Dec', value: 1500 },
];

const goldPriceData = [
  { date: 'Jan', price: 1800 },
  { date: 'Feb', price: 1820 },
  { date: 'Mar', price: 1850 },
  { date: 'Apr', price: 1830 },
  { date: 'May', price: 1860 },
  { date: 'Jun', price: 1880 },
  { date: 'Jul', price: 1900 },
  { date: 'Aug', price: 1920 },
  { date: 'Sep', price: 1950 },
  { date: 'Oct', price: 1980 },
  { date: 'Nov', price: 2000 },
  { date: 'Dec', price: 2050 },
];

const Dashboard = () => {
  const [userInvestments, setUserInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalInvested: 0,
    currentValue: 0,
    profit: 0,
    profitPercentage: 0,
    goldWeight: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [marketData, setMarketData] = useState({
    goldPrice: 0,
    priceChange: 0,
    priceChangePercentage: 0
  });
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be real API calls
        // For now we'll use mock data
        
        // Fetch user's investments
        // const investmentsResponse = await axios.get('/api/investments/user');
        // setUserInvestments(investmentsResponse.data);
        
        // Mock investments data
        const mockInvestments = [
          {
            id: '1',
            type: 'Gold Bullion',
            amount: 500,
            goldWeight: 0.25,
            purchaseDate: '2023-01-15',
            purchasePrice: 1850,
            currentPrice: 2050,
            profit: 50,
            profitPercentage: 10.81
          },
          {
            id: '2',
            type: 'Gold Sovereign',
            amount: 750,
            goldWeight: 0.35,
            purchaseDate: '2023-03-10',
            purchasePrice: 1900,
            currentPrice: 2050,
            profit: 52.5,
            profitPercentage: 7.89
          },
          {
            id: '3',
            type: 'Gold ETF',
            amount: 1000,
            goldWeight: 0.5,
            purchaseDate: '2023-06-20',
            purchasePrice: 1950,
            currentPrice: 2050,
            profit: 50,
            profitPercentage: 5.13
          }
        ];
        setUserInvestments(mockInvestments);
        
        // Calculate portfolio summary
        const totalInvested = mockInvestments.reduce((total, investment) => total + investment.amount, 0);
        const currentValue = mockInvestments.reduce(
          (total, investment) => total + (investment.amount * (investment.currentPrice / investment.purchasePrice)), 
          0
        );
        const profit = currentValue - totalInvested;
        const profitPercentage = (profit / totalInvested) * 100;
        const goldWeight = mockInvestments.reduce((total, investment) => total + investment.goldWeight, 0);
        
        setPortfolioSummary({
          totalInvested,
          currentValue,
          profit,
          profitPercentage,
          goldWeight
        });
        
        // Mock recent transactions
        const mockTransactions = [
          { id: '1', type: 'Purchase', description: 'Gold Bullion', amount: 500, date: '2023-11-15', status: 'Completed' },
          { id: '2', type: 'Withdrawal', description: 'Cash Withdrawal', amount: 200, date: '2023-10-28', status: 'Completed' },
          { id: '3', type: 'Purchase', description: 'Gold ETF', amount: 1000, date: '2023-10-05', status: 'Completed' },
          { id: '4', type: 'Deposit', description: 'Bank Transfer', amount: 1500, date: '2023-09-20', status: 'Completed' }
        ];
        setRecentTransactions(mockTransactions);
        
        // Mock market data
        setMarketData({
          goldPrice: 2050.75,
          priceChange: 12.50,
          priceChangePercentage: 0.61
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark text-white p-2 rounded border border-warning">
          <p className="mb-0">{`${label}: $${payload[0].value}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  const renderInvestmentCards = () => {
    return userInvestments.map(investment => (
      <div className="col-md-4 mb-4" key={investment.id}>
        <div className="card bg-dark text-white border-warning h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">{investment.type}</h5>
              <span className="badge bg-warning text-dark rounded-pill">{investment.goldWeight} oz</span>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Investment:</span>
                <span>${investment.amount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Current Value:</span>
                <span>${(investment.amount * (investment.currentPrice / investment.purchasePrice)).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Purchase Date:</span>
                <span>{new Date(investment.purchaseDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className={`badge ${investment.profitPercentage >= 0 ? 'bg-success' : 'bg-danger'}`}>
                {investment.profitPercentage >= 0 ? '+' : ''}{investment.profitPercentage.toFixed(2)}%
              </span>
              <Link to={`/investments/${investment.id}`} className="btn btn-sm btn-outline-warning">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    ));
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-fluid py-4">
      {/* Welcome Section */}
      <div className="bg-dark text-white p-4 rounded shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="mb-1">Welcome back, {user?.firstName || 'Investor'}</h2>
            <p className="text-muted mb-0">Here's what's happening with your investments today.</p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <Link to="/investments/new" className="btn btn-warning me-2">
              <i className="fas fa-plus-circle me-2"></i>New Investment
            </Link>
            <Link to="/profile" className="btn btn-outline-light">
              <i className="fas fa-user me-2"></i>Profile
            </Link>
          </div>
        </div>
      </div>
      
      {/* Portfolio Summary Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card bg-dark text-white border-warning h-100">
            <div className="card-header bg-dark border-warning">
              <h5 className="mb-0">Portfolio Performance</h5>
            </div>
            <div className="card-body">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={portfolioPerformanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ffc107" 
                      strokeWidth={2}
                      dot={{ r: 4, stroke: '#ffc107', strokeWidth: 2, fill: '#000' }}
                      activeDot={{ r: 6, stroke: '#ffc107', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-dark text-white border-warning h-100">
            <div className="card-header bg-dark border-warning">
              <h5 className="mb-0">Portfolio Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Invested:</span>
                  <span className="fw-bold">${portfolioSummary.totalInvested.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Current Value:</span>
                  <span className="fw-bold">${portfolioSummary.currentValue.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Profit/Loss:</span>
                  <span className={`fw-bold ${portfolioSummary.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {portfolioSummary.profit >= 0 ? '+' : ''}${portfolioSummary.profit.toFixed(2)} 
                    ({portfolioSummary.profitPercentage.toFixed(2)}%)
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Gold Weight:</span>
                  <span className="fw-bold">{portfolioSummary.goldWeight.toFixed(2)} oz</span>
                </div>
              </div>
              
              <div className="pt-3 border-top border-secondary">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Current Gold Price</h6>
                  <span className="badge bg-warning text-dark">Live</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">${marketData.goldPrice.toFixed(2)}</h3>
                  <span className={`badge ${marketData.priceChange >= 0 ? 'bg-success' : 'bg-danger'}`}>
                    {marketData.priceChange >= 0 ? '+' : ''}{marketData.priceChange.toFixed(2)} 
                    ({marketData.priceChangePercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gold Price Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-dark text-white border-warning">
            <div className="card-header bg-dark border-warning d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Gold Price History</h5>
              <div>
                <button className="btn btn-sm btn-outline-warning me-2">1M</button>
                <button className="btn btn-sm btn-warning me-2">1Y</button>
                <button className="btn btn-sm btn-outline-warning me-2">5Y</button>
                <button className="btn btn-sm btn-outline-warning">Max</button>
              </div>
            </div>
            <div className="card-body">
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={goldPriceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" domain={['dataMin - 50', 'dataMax + 50']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#FFA500" 
                      strokeWidth={2}
                      dot={{ r: 4, stroke: '#FFA500', strokeWidth: 2, fill: '#000' }}
                      activeDot={{ r: 6, stroke: '#FFA500', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Your Investments */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-white">Your Investments</h4>
          <Link to="/investments" className="btn btn-sm btn-outline-warning">
            View All
          </Link>
        </div>
        <div className="row">
          {renderInvestmentCards()}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-white">Recent Transactions</h4>
          <Link to="/transactions" className="btn btn-sm btn-outline-warning">
            View All
          </Link>
        </div>
        <div className="card bg-dark text-white border-warning">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead className="border-warning">
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>
                      <span className={`badge ${
                        transaction.type === 'Purchase' ? 'bg-info' : 
                        transaction.type === 'Deposit' ? 'bg-success' : 
                        transaction.type === 'Withdrawal' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.description}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-success">{transaction.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card bg-dark text-white border-warning">
            <div className="card-body">
              <h5 className="card-title mb-4">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <Link to="/investments/new" className="card bg-dark border-warning p-3 text-center h-100 text-decoration-none">
                    <div className="text-warning mb-2">
                      <i className="fas fa-plus-circle fa-2x"></i>
                    </div>
                    <h6 className="mb-0 text-white">Add Investment</h6>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/wallet/deposit" className="card bg-dark border-warning p-3 text-center h-100 text-decoration-none">
                    <div className="text-warning mb-2">
                      <i className="fas fa-wallet fa-2x"></i>
                    </div>
                    <h6 className="mb-0 text-white">Deposit Funds</h6>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/wallet/withdraw" className="card bg-dark border-warning p-3 text-center h-100 text-decoration-none">
                    <div className="text-warning mb-2">
                      <i className="fas fa-money-bill-wave fa-2x"></i>
                    </div>
                    <h6 className="mb-0 text-white">Withdraw Funds</h6>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/learn" className="card bg-dark border-warning p-3 text-center h-100 text-decoration-none">
                    <div className="text-warning mb-2">
                      <i className="fas fa-book-open fa-2x"></i>
                    </div>
                    <h6 className="mb-0 text-white">Investment Guides</h6>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 