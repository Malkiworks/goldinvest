import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Investment = () => {
  const { id } = useParams();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/investments/${id}`);
        // setInvestment(response.data);
        
        // For demo purposes, we'll simulate a response
        setTimeout(() => {
          setInvestment({
            id,
            type: 'Gold Bullion',
            amount: 500,
            goldWeight: 0.25,
            purchaseDate: '2023-01-15',
            purchasePrice: 1850,
            currentPrice: 2050,
            profit: 50,
            profitPercentage: 10.81
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching investment:', err);
        setError('Failed to load investment details');
        setLoading(false);
      }
    };
    
    fetchInvestment();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/dashboard" className="btn btn-warning">
          <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {investment && (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card bg-dark text-white border-warning">
              <div className="card-header bg-dark border-warning d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-warning">{investment.type} Details</h3>
                <span className="badge bg-warning text-dark">{investment.goldWeight} oz</span>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="text-muted mb-3">Investment Information</h5>
                    <ul className="list-group list-group-flush bg-transparent">
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Initial Investment:</span>
                        <span className="fw-bold">${investment.amount.toFixed(2)}</span>
                      </li>
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Current Value:</span>
                        <span className="fw-bold">${(investment.amount * (investment.currentPrice / investment.purchasePrice)).toFixed(2)}</span>
                      </li>
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Profit/Loss:</span>
                        <span className={`fw-bold ${investment.profitPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                          {investment.profitPercentage >= 0 ? '+' : ''}${(investment.amount * (investment.currentPrice / investment.purchasePrice) - investment.amount).toFixed(2)}
                        </span>
                      </li>
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Return Rate:</span>
                        <span className={`fw-bold ${investment.profitPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                          {investment.profitPercentage >= 0 ? '+' : ''}{investment.profitPercentage.toFixed(2)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-muted mb-3">Gold Details</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Purchase Date:</span>
                        <span className="fw-bold">{new Date(investment.purchaseDate).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Purchase Price:</span>
                        <span className="fw-bold">${investment.purchasePrice.toFixed(2)}/oz</span>
                      </li>
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Current Price:</span>
                        <span className="fw-bold">${investment.currentPrice.toFixed(2)}/oz</span>
                      </li>
                      <li className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        <span>Price Change:</span>
                        <span className={`fw-bold ${investment.currentPrice >= investment.purchasePrice ? 'text-success' : 'text-danger'}`}>
                          {investment.currentPrice >= investment.purchasePrice ? '+' : ''}${(investment.currentPrice - investment.purchasePrice).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/dashboard" className="btn btn-outline-warning">
                    <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                  </Link>
                  <button className="btn btn-warning">
                    <i className="fas fa-money-bill-wave me-2"></i>Sell Investment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investment; 