import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call your backend API
      // const response = await axios.post('/api/auth/register', formData);
      
      // Simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response && error.response.status === 409) {
        toast.error('This email is already registered');
        setErrors({
          ...errors,
          email: 'This email is already registered'
        });
      } else if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const renderStep1 = () => (
    <>
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <div className="input-group">
          <span className="input-group-text bg-dark border-warning text-warning">
            <i className="fas fa-user"></i>
          </span>
          <input
            type="text"
            className={`form-control bg-dark text-white border-warning ${errors.firstName ? 'is-invalid' : ''}`}
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Last Name</label>
        <div className="input-group">
          <span className="input-group-text bg-dark border-warning text-warning">
            <i className="fas fa-user"></i>
          </span>
          <input
            type="text"
            className={`form-control bg-dark text-white border-warning ${errors.lastName ? 'is-invalid' : ''}`}
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>
      </div>
      
      <div className="mb-4">
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
      
      <button 
        type="button" 
        className="btn btn-warning w-100 py-2 mb-3"
        onClick={handleNextStep}
      >
        Next Step <i className="fas fa-arrow-right ms-1"></i>
      </button>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-group">
          <span className="input-group-text bg-dark border-warning text-warning">
            <i className="fas fa-lock"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control bg-dark text-white border-warning ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            placeholder="Create a password"
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
        <div className="form-text text-muted small">
          Password must be at least 8 characters with uppercase, lowercase, and numbers.
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <div className="input-group">
          <span className="input-group-text bg-dark border-warning text-warning">
            <i className="fas fa-lock"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control bg-dark text-white border-warning ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="form-check">
          <input
            type="checkbox"
            className={`form-check-input border-warning ${errors.agreeToTerms ? 'is-invalid' : ''}`}
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="agreeToTerms">
            I agree to the <Link to="/terms" className="text-warning">Terms and Conditions</Link> and <Link to="/privacy" className="text-warning">Privacy Policy</Link>
          </label>
          {errors.agreeToTerms && <div className="invalid-feedback">{errors.agreeToTerms}</div>}
        </div>
      </div>
      
      <div className="d-flex gap-2 mb-3">
        <button 
          type="button" 
          className="btn btn-outline-warning flex-grow-1 py-2"
          onClick={handlePrevStep}
        >
          <i className="fas fa-arrow-left me-1"></i> Back
        </button>
        <button 
          type="submit" 
          className="btn btn-warning flex-grow-1 py-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creating Account...
            </>
          ) : 'Create Account'}
        </button>
      </div>
    </>
  );
  
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
                  <h3 className="text-warning">Create an Account</h3>
                  <p className="text-muted">
                    Step {step} of 2: {step === 1 ? 'Personal Information' : 'Security & Verification'}
                  </p>
                  <div className="progress bg-dark mb-3">
                    <div 
                      className="progress-bar bg-warning" 
                      role="progressbar" 
                      style={{ width: step === 1 ? '50%' : '100%' }}
                      aria-valuenow={step === 1 ? 50 : 100} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {step === 1 ? renderStep1() : renderStep2()}
                  
                  {step === 1 && (
                    <div className="text-center">
                      <p className="mb-0">
                        Already have an account? <Link to="/login" className="text-warning">Login</Link>
                      </p>
                    </div>
                  )}
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
              <h2 className="display-5 mb-4">Join the <span className="text-warning">Gold</span> Revolution</h2>
              <p className="mb-4 fs-5">Create your account to start investing in gold and secure your financial future.</p>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-2 me-3">
                    <i className="fas fa-check text-dark"></i>
                  </div>
                  <span>Easy and secure account setup</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-2 me-3">
                    <i className="fas fa-check text-dark"></i>
                  </div>
                  <span>Start investing with as little as $100</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-2 me-3">
                    <i className="fas fa-check text-dark"></i>
                  </div>
                  <span>No hidden fees or commissions</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-2 me-3">
                    <i className="fas fa-check text-dark"></i>
                  </div>
                  <span>Expert guidance and market insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 