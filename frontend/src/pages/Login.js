import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the login method from AuthContext with email and password
      const result = await login(formData.email, formData.password);
      
      if (result && result.success) {
        toast.success('Login successful!');
        
        // Redirect based on user role
        if (result.user && result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error responses
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Invalid email or password');
        } else if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Login failed. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center" 
         style={{
           backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/gold-background.jpg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card bg-dark text-white border-warning">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <img src="/images/logo.png" alt="GoldInvest Logo" width="120" className="mb-3" />
                  <h3 className="text-warning">Login to Your Account</h3>
                  <p className="text-muted">Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-warning text-warning">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control bg-dark text-white border-warning ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Link to="/forgot-password" className="text-warning text-decoration-none small">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-warning text-warning">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control bg-dark text-white border-warning ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="input-group-text bg-dark border-warning text-warning"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input border-warning"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-warning w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : 'Login'}
                  </button>
                  
                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account? <Link to="/register" className="text-warning">Register</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="text-center mt-4 text-white">
              <Link to="/" className="text-warning text-decoration-none">
                <i className="fas fa-arrow-left me-2"></i>Back to Home
              </Link>
            </div>
          </div>
          
          <div className="col-lg-5 d-none d-lg-block">
            <div className="h-100 d-flex flex-column justify-content-center text-white ps-4">
              <h2 className="display-5 mb-4">Invest in <span className="text-warning">Gold</span></h2>
              <p className="mb-4 fs-5">Secure your future with the world's most trusted precious metal. Our platform provides easy and secure access to gold investment options.</p>
              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-shield-alt text-warning me-3 fs-4"></i>
                  <span>Secure and insured investments</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-chart-line text-warning me-3 fs-4"></i>
                  <span>Track your portfolio in real-time</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-hand-holding-usd text-warning me-3 fs-4"></i>
                  <span>Start with as little as $100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 