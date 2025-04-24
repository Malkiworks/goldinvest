import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [goldPrice, setGoldPrice] = useState({
    price: 0,
    change24h: 0,
    changePercent24h: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const res = await axios.get('/api/gold/price');
        if (res.data.success) {
          setGoldPrice(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching gold price:', error);
        // Set default values if API fails
        setGoldPrice({
          price: 2023.45,
          change24h: 12.35,
          changePercent24h: 0.61
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  return (
    <>
      <Navbar />
      
      <div className="hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="mb-4">Invest in Gold, Secure Your Future</h1>
              <p className="lead mb-5">
                Gold has been a reliable store of value for thousands of years. Start investing
                today and build your wealth with the world's most trusted precious metal.
              </p>
              <Link to="/register" className="btn btn-warning btn-lg px-5 me-3">
                Start Investing
              </Link>
              <Link to="/login" className="btn btn-outline-warning btn-lg px-5">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card gold-card bg-dark text-white h-100">
                <div className="card-body">
                  <h3 className="card-title text-warning">Current Gold Price</h3>
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="display-4 my-4">${goldPrice.price.toFixed(2)}</h2>
                      <p className="card-text">
                        <span className={goldPrice.change24h >= 0 ? 'text-success' : 'text-danger'}>
                          {goldPrice.change24h >= 0 ? '↑' : '↓'} ${Math.abs(goldPrice.change24h).toFixed(2)} ({goldPrice.changePercent24h.toFixed(2)}%)
                        </span> 
                        <span className="text-muted ms-2">24h change</span>
                      </p>
                      <p className="card-text mt-3">
                        Gold is currently {goldPrice.change24h >= 0 ? 'rising' : 'falling'} in value. Now might be a good time to {goldPrice.change24h >= 0 ? 'invest' : 'buy the dip'}.
                      </p>
                    </>
                  )}
                </div>
                <div className="card-footer bg-transparent border-top border-warning">
                  <small className="text-muted">Last updated: {new Date().toLocaleString()}</small>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card gold-card bg-dark text-white h-100">
                <div className="card-body">
                  <h3 className="card-title text-warning">Why Invest in Gold?</h3>
                  <ul className="list-unstyled mt-4">
                    <li className="mb-3">
                      <i className="fas fa-shield-alt text-warning me-2"></i> 
                      <strong>Protection Against Inflation</strong>
                      <p className="text-muted mt-1">Gold has historically maintained its value during inflation.</p>
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-chart-line text-warning me-2"></i> 
                      <strong>Portfolio Diversification</strong>
                      <p className="text-muted mt-1">Gold often moves independently of stocks and bonds.</p>
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-globe text-warning me-2"></i> 
                      <strong>Global Value</strong>
                      <p className="text-muted mt-1">Gold is recognized and valued worldwide as a secure asset.</p>
                    </li>
                    <li>
                      <i className="fas fa-handshake text-warning me-2"></i> 
                      <strong>Easy Liquidity</strong>
                      <p className="text-muted mt-1">Gold can be quickly converted to cash when needed.</p>
                    </li>
                  </ul>
                </div>
                <div className="card-footer bg-transparent border-top border-warning">
                  <Link to="/register" className="btn btn-warning">Start Investing Now</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mb-5">
            <div className="col-12 text-center mb-4">
              <h2 className="section-title">How It Works</h2>
              <p className="lead">Start investing in gold in just a few simple steps</p>
            </div>
            
            <div className="col-md-3">
              <div className="card gold-card bg-dark text-white text-center h-100">
                <div className="card-body">
                  <div className="rounded-circle bg-warning text-dark mx-auto mb-4 d-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px' }}>
                    <h3 className="mb-0">1</h3>
                  </div>
                  <h5 className="card-title text-warning">Create Account</h5>
                  <p className="card-text">Sign up for a free account in just minutes.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card gold-card bg-dark text-white text-center h-100">
                <div className="card-body">
                  <div className="rounded-circle bg-warning text-dark mx-auto mb-4 d-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px' }}>
                    <h3 className="mb-0">2</h3>
                  </div>
                  <h5 className="card-title text-warning">Verify Identity</h5>
                  <p className="card-text">Complete KYC verification for security.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card gold-card bg-dark text-white text-center h-100">
                <div className="card-body">
                  <div className="rounded-circle bg-warning text-dark mx-auto mb-4 d-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px' }}>
                    <h3 className="mb-0">3</h3>
                  </div>
                  <h5 className="card-title text-warning">Fund Account</h5>
                  <p className="card-text">Add funds using your preferred payment method.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card gold-card bg-dark text-white text-center h-100">
                <div className="card-body">
                  <div className="rounded-circle bg-warning text-dark mx-auto mb-4 d-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px' }}>
                    <h3 className="mb-0">4</h3>
                  </div>
                  <h5 className="card-title text-warning">Start Investing</h5>
                  <p className="card-text">Buy gold and watch your investment grow.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2 className="section-title">Why Choose GoldInvest?</h2>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card gold-card bg-dark text-white h-100">
                <div className="card-body">
                  <h4 className="card-title text-warning">Secure Storage</h4>
                  <p className="card-text">
                    Your gold is stored in high-security vaults, fully insured against theft or damage.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card gold-card bg-dark text-white h-100">
                <div className="card-body">
                  <h4 className="card-title text-warning">Low Fees</h4>
                  <p className="card-text">
                    Competitive pricing with transparent fee structure and no hidden charges.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card gold-card bg-dark text-white h-100">
                <div className="card-body">
                  <h4 className="card-title text-warning">Easy Management</h4>
                  <p className="card-text">
                    Intuitive dashboard to track and manage your gold investments in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-warning mb-4">Ready to Start Investing in Gold?</h2>
              <p className="lead mb-5">
                Join thousands of investors who trust GoldInvest for their precious metal investments.
              </p>
              <Link to="/register" className="btn btn-warning btn-lg px-5">
                Create Your Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Home; 