import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

const KycVerification = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    idNumber: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    birthDate: ''
  });
  
  const [files, setFiles] = useState({
    idProof: null,
    addressProof: null,
    selfie: null
  });
  
  const [fileNames, setFileNames] = useState({
    idProof: '',
    addressProof: '',
    selfie: ''
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    // If user is already KYC verified, redirect to dashboard
    if (user?.kycStatus === 'approved') {
      navigate('/dashboard');
    }
    
    // If user already started KYC process, pre-fill the form
    if (user) {
      setFormData({
        idNumber: user.idNumber || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
      });
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setFileNames(prev => ({
        ...prev,
        [name]: files[0].name
      }));
    }
  };
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create form data for file uploads
      const kycData = new FormData();
      
      // Add personal information
      Object.keys(formData).forEach(key => {
        kycData.append(key, formData[key]);
      });
      
      // Add files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          kycData.append(key, files[key]);
        }
      });
      
      // Submit KYC data
      const response = await axios.post('/api/users/kyc', kycData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess('KYC verification submitted successfully. It will be reviewed shortly.');
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setError(
        err.response?.data?.message || 'Failed to submit KYC. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4 className="mb-4">Personal Information</h4>
            <div className="mb-3">
              <label htmlFor="idNumber" className="form-label">National ID / Passport Number</label>
              <input
                type="text"
                className="form-control"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleNextStep}
              >
                Next <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h4 className="mb-4">Address Information</h4>
            <div className="mb-3">
              <label htmlFor="street" className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="state" className="form-label">State/Province</label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrevStep}
              >
                <i className="fas fa-arrow-left me-2"></i> Back
              </button>
              
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleNextStep}
              >
                Next <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h4 className="mb-4">Document Upload</h4>
            <p className="text-muted mb-4">
              Please upload clear, readable images of the following documents:
            </p>
            
            <div className="mb-4">
              <label htmlFor="idProof" className="form-label">
                ID Proof (Passport, Driver's License, National ID)
              </label>
              <div className="input-group mb-2">
                <input
                  type="file"
                  className="form-control"
                  id="idProof"
                  name="idProof"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              {fileNames.idProof && (
                <div className="form-text text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  {fileNames.idProof} selected
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="addressProof" className="form-label">
                Proof of Address (Utility Bill, Bank Statement)
              </label>
              <div className="input-group mb-2">
                <input
                  type="file"
                  className="form-control"
                  id="addressProof"
                  name="addressProof"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              {fileNames.addressProof && (
                <div className="form-text text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  {fileNames.addressProof} selected
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="selfie" className="form-label">
                Selfie with ID Document
              </label>
              <div className="input-group mb-2">
                <input
                  type="file"
                  className="form-control"
                  id="selfie"
                  name="selfie"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  required
                />
              </div>
              {fileNames.selfie && (
                <div className="form-text text-success">
                  <i className="fas fa-check-circle me-1"></i>
                  {fileNames.selfie} selected
                </div>
              )}
            </div>
            
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrevStep}
              >
                <i className="fas fa-arrow-left me-2"></i> Back
              </button>
              
              <button
                type="submit"
                className="btn btn-warning"
                disabled={!files.idProof || !files.addressProof || !files.selfie}
              >
                Submit KYC
              </button>
            </div>
          </>
        );
        
      default:
        return null;
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
                <h3 className="text-warning text-center mb-0">KYC Verification</h3>
              </div>
              <div className="card-body">
                {user?.kycStatus === 'pending' ? (
                  <div className="text-center py-4">
                    <i className="fas fa-clock text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mb-3">KYC Verification In Progress</h4>
                    <p className="mb-0">
                      Your KYC documents have been submitted and are currently under review.
                      This process typically takes 1-2 business days. We'll notify you once it's complete.
                    </p>
                  </div>
                ) : user?.kycStatus === 'rejected' ? (
                  <div className="mb-4">
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Your previous KYC verification was rejected. Reason: {user?.kycDocuments?.rejectionReason || 'Please contact support for details.'}
                    </div>
                  </div>
                ) : user?.kycStatus === 'resubmission_requested' ? (
                  <div className="mb-4">
                    <div className="alert alert-warning" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <strong>Resubmission Requested:</strong> {user?.kycDocuments?.resubmissionMessage || 'Please update your KYC documents and resubmit.'}
                    </div>
                  </div>
                ) : null}
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}
                
                {(user?.kycStatus !== 'pending' || user?.kycStatus === 'rejected' || user?.kycStatus === 'resubmission_requested') && (
                  <div className="mb-4">
                    <div className="progress" style={{ height: '2px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${(step / 3) * 100}%` }}
                        aria-valuenow={step}
                        aria-valuemin="0"
                        aria-valuemax="3"
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <small className={step >= 1 ? 'text-warning' : 'text-muted'}>Personal Info</small>
                      <small className={step >= 2 ? 'text-warning' : 'text-muted'}>Address</small>
                      <small className={step >= 3 ? 'text-warning' : 'text-muted'}>Documents</small>
                    </div>
                  </div>
                )}
                
                {(user?.kycStatus !== 'pending' || user?.kycStatus === 'rejected' || user?.kycStatus === 'resubmission_requested') && (
                  <form onSubmit={handleSubmit}>
                    {renderStepContent()}
                  </form>
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

export default KycVerification; 