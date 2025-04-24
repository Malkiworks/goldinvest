import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put('/api/users/profile', {
        name: profile.name,
        phone: profile.phone
      });
      
      if (response.data.success) {
        updateUser(response.data.user);
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully'
        });
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (profile.newPassword !== profile.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }
    
    if (profile.newPassword.length < 8) {
      setMessage({ type: 'danger', text: 'Password must be at least 8 characters long' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put('/api/users/password', {
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      });
      
      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password changed successfully'
        });
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (err) {
      console.error('Password change error:', err);
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      
      {loading && <Spinner />}
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card gold-card bg-dark text-white">
              <div className="card-header bg-dark border-warning">
                <h3 className="text-warning text-center mb-0">My Profile</h3>
              </div>
              <div className="card-body">
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'profile' ? 'active bg-warning text-dark' : 'text-white'}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <i className="fas fa-user me-2"></i>Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'security' ? 'active bg-warning text-dark' : 'text-white'}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <i className="fas fa-lock me-2"></i>Security
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'kyc' ? 'active bg-warning text-dark' : 'text-white'}`}
                      onClick={() => setActiveTab('kyc')}
                    >
                      <i className="fas fa-id-card me-2"></i>KYC
                    </button>
                  </li>
                </ul>
                
                {message.text && (
                  <div className={`alert alert-${message.type}`} role="alert">
                    {message.type === 'success' ? (
                      <i className="fas fa-check-circle me-2"></i>
                    ) : (
                      <i className="fas fa-exclamation-triangle me-2"></i>
                    )}
                    {message.text}
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={profile.email}
                        disabled
                        readOnly
                      />
                      <div className="form-text text-muted">
                        Email address cannot be changed
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                )}
                
                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Current Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={profile.currentPassword}
                          onChange={handleChange}
                          required
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={profile.newPassword}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                      <div className="form-text text-muted">
                        Password must be at least 8 characters long
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={profile.confirmPassword}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                )}
                
                {activeTab === 'kyc' && (
                  <div>
                    <div className="mb-4">
                      <h5 className="mb-3">KYC Verification Status</h5>
                      
                      {user?.kycStatus === 'approved' ? (
                        <div className="alert alert-success" role="alert">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-check-circle fa-2x"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">Verification Complete</h6>
                              <p className="mb-0">Your account is fully verified. You can now invest in gold.</p>
                            </div>
                          </div>
                        </div>
                      ) : user?.kycStatus === 'pending' ? (
                        <div className="alert alert-warning" role="alert">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-clock fa-2x"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">Verification In Progress</h6>
                              <p className="mb-0">Your documents are under review. This typically takes 1-2 business days.</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-danger" role="alert">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-exclamation-triangle fa-2x"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">Verification Required</h6>
                              <p className="mb-0">
                                {user?.kycStatus === 'rejected' 
                                  ? `Your verification was rejected. Reason: ${user?.kycDocuments?.rejectionReason || 'Please contact support for details.'}`
                                  : 'Complete KYC verification to start investing in gold.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {user?.kycStatus !== 'approved' && (
                      <div className="text-center">
                        <Link to="/kyc" className="btn btn-warning">
                          {user?.kycStatus === 'rejected' ? 'Resubmit KYC' : 'Complete KYC Verification'}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Profile; 