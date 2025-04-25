import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('kycVerifications');
  const [pendingKyc, setPendingKyc] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [resubmissionMessage, setResubmissionMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [modalType, setModalType] = useState('reject'); // 'reject' or 'resubmit'
  
  useEffect(() => {
    // Fetch data based on active tab
    const fetchData = async () => {
      setPageLoading(true);
      try {
        if (activeTab === 'kycVerifications') {
          const res = await axios.get('/api/users/kyc/pending');
          if (res.data && res.data.data) {
            setPendingKyc(res.data.data);
          } else {
            setPendingKyc([]);
            console.error('Invalid response format:', res.data);
          }
        } else if (activeTab === 'users') {
          const res = await axios.get('/api/admin/users');
          if (res.data && res.data.data) {
            setAllUsers(res.data.data);
          } else {
            setAllUsers([]);
            console.error('Invalid response format:', res.data);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response) {
          // Server responded with an error
          toast.error(`Failed to load data: ${err.response.data?.message || err.response.statusText}`);
        } else if (err.request) {
          // Request was made but no response
          toast.error('No response from server. Check your connection.');
        } else {
          // Something went wrong in the request setup
          toast.error('Failed to load data. Please try again.');
        }
        
        // Initialize with empty arrays to prevent UI errors
        if (activeTab === 'kycVerifications') {
          setPendingKyc([]);
        } else if (activeTab === 'users') {
          setAllUsers([]);
        }
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchData();
    }
  }, [activeTab, isAuthenticated, user]);

  // Redirect if not admin
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  const openReviewModal = (user) => {
    setSelectedUser(user);
    setReviewModalOpen(true);
  };

  const handleApproveKyc = async (userId) => {
    try {
      await axios.put(`/api/users/kyc/${userId}/approve`);
      toast.success('KYC approved successfully');
      // Remove from pending list
      setPendingKyc(pendingKyc.filter(user => user._id !== userId));
      setReviewModalOpen(false);
    } catch (err) {
      console.error('Error approving KYC:', err);
      toast.error('Failed to approve KYC');
    }
  };

  const openRejectModal = (user) => {
    setSelectedUser(user);
    setRejectionReason('');
    setModalType('reject');
    setModalOpen(true);
  };

  const openResubmitModal = (user) => {
    setSelectedUser(user);
    setResubmissionMessage('');
    setModalType('resubmit');
    setModalOpen(true);
  };

  const handleRejectKyc = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      await axios.put(`/api/users/kyc/${selectedUser._id}/reject`, {
        rejectionReason
      });
      toast.success('KYC rejected successfully');
      // Remove from pending list
      setPendingKyc(pendingKyc.filter(user => user._id !== selectedUser._id));
      setModalOpen(false);
      setReviewModalOpen(false);
    } catch (err) {
      console.error('Error rejecting KYC:', err);
      toast.error('Failed to reject KYC');
    }
  };

  const handleRequestResubmission = async () => {
    if (!resubmissionMessage.trim()) {
      toast.error('Resubmission message is required');
      return;
    }

    try {
      await axios.put(`/api/users/kyc/${selectedUser._id}/resubmit`, {
        resubmissionMessage
      });
      toast.success('Resubmission request sent successfully');
      // Remove from pending list
      setPendingKyc(pendingKyc.filter(user => user._id !== selectedUser._id));
      setModalOpen(false);
      setReviewModalOpen(false);
    } catch (err) {
      console.error('Error requesting resubmission:', err);
      toast.error('Failed to request resubmission');
    }
  };

  const renderKycVerifications = () => (
    <div className="card bg-dark text-white border-warning mb-4">
      <div className="card-header bg-dark border-warning d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-warning">Pending KYC Verifications</h5>
        <span className="badge bg-warning text-dark">{pendingKyc.length} Pending</span>
      </div>
      <div className="card-body">
        {pageLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : pendingKyc.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
            <h5>No pending KYC verifications</h5>
            <p className="text-muted">All KYC requests have been processed.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Submission Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingKyc.map(user => (
                  <tr key={user._id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-primary" 
                          onClick={() => openReviewModal(user)}
                        >
                          <i className="fas fa-search me-1"></i> Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsersList = () => (
    <div className="card bg-dark text-white border-warning mb-4">
      <div className="card-header bg-dark border-warning d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-warning">All Users</h5>
        <span className="badge bg-warning text-dark">{allUsers.length} Total</span>
      </div>
      <div className="card-body">
        {pageLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : allUsers.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-users text-warning mb-3" style={{ fontSize: '3rem' }}></i>
            <h5>No users found</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>KYC Status</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.kycStatus === 'approved' ? 'bg-success' :
                        user.kycStatus === 'pending' ? 'bg-warning text-dark' :
                        user.kycStatus === 'rejected' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <div className="bg-dark border-bottom border-warning">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="text-warning mb-0">Admin Dashboard</h3>
            </div>
            <div>
              <Link to="/dashboard" className="btn btn-outline-warning btn-sm">
                <i className="fas fa-user me-1"></i> User Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card bg-dark border-warning">
              <div className="card-header bg-dark border-warning">
                <h5 className="mb-0 text-warning">Navigation</h5>
              </div>
              <div className="card-body p-0">
                <ul className="nav nav-pills flex-column">
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 rounded-0 ${activeTab === 'kycVerifications' ? 'active bg-warning text-dark' : 'text-white'}`}
                      onClick={() => setActiveTab('kycVerifications')}
                    >
                      <i className="fas fa-id-card me-2"></i> KYC Verifications
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 rounded-0 ${activeTab === 'users' ? 'active bg-warning text-dark' : 'text-white'}`}
                      onClick={() => setActiveTab('users')}
                    >
                      <i className="fas fa-users me-2"></i> Users
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {activeTab === 'kycVerifications' && renderKycVerifications()}
            {activeTab === 'users' && renderUsersList()}
          </div>
        </div>
      </div>

      {/* KYC Review Modal */}
      {reviewModalOpen && selectedUser && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-warning">
              <div className="modal-header bg-dark border-warning">
                <h5 className="modal-title text-warning">KYC Verification Review</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setReviewModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-warning mb-3">Personal Information</h6>
                    <table className="table table-dark table-sm table-bordered">
                      <tbody>
                        <tr>
                          <th>Name:</th>
                          <td>{selectedUser.firstName} {selectedUser.lastName}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedUser.email}</td>
                        </tr>
                        <tr>
                          <th>ID Number:</th>
                          <td>{selectedUser.idNumber || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <th>Birth Date:</th>
                          <td>{selectedUser.birthDate ? new Date(selectedUser.birthDate).toLocaleDateString() : 'Not provided'}</td>
                        </tr>
                        <tr>
                          <th>Phone:</th>
                          <td>{selectedUser.phone || 'Not provided'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-warning mb-3">Address Information</h6>
                    <table className="table table-dark table-sm table-bordered">
                      <tbody>
                        <tr>
                          <th>Street:</th>
                          <td>{selectedUser.address?.street || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <th>City:</th>
                          <td>{selectedUser.address?.city || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <th>State:</th>
                          <td>{selectedUser.address?.state || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <th>Postal Code:</th>
                          <td>{selectedUser.address?.postalCode || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <th>Country:</th>
                          <td>{selectedUser.address?.country || 'Not provided'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h6 className="text-warning mb-3">KYC Documents</h6>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card bg-dark border-warning h-100">
                      <div className="card-header bg-dark border-warning">
                        <h6 className="mb-0">ID Proof</h6>
                      </div>
                      <div className="card-body text-center">
                        {selectedUser.kycDocuments?.idProof ? (
                          <img 
                            src={`http://localhost:5000${selectedUser.kycDocuments.idProof}`} 
                            alt="ID Proof" 
                            className="img-fluid" 
                            style={{ maxHeight: '200px' }}
                            onError={(e) => {e.target.onerror = null; e.target.src='/images/document-placeholder.png'}}
                          />
                        ) : (
                          <div className="py-5">
                            <i className="fas fa-file-image text-warning mb-2" style={{ fontSize: '3rem' }}></i>
                            <p>No ID proof uploaded</p>
                          </div>
                        )}
                      </div>
                      <div className="card-footer bg-dark border-warning">
                        {selectedUser.kycDocuments?.idProof && (
                          <a href={`http://localhost:5000${selectedUser.kycDocuments.idProof}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="btn btn-sm btn-warning w-100">
                            <i className="fas fa-search-plus me-1"></i> View Full Size
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-dark border-warning h-100">
                      <div className="card-header bg-dark border-warning">
                        <h6 className="mb-0">Address Proof</h6>
                      </div>
                      <div className="card-body text-center">
                        {selectedUser.kycDocuments?.addressProof ? (
                          <img 
                            src={`http://localhost:5000${selectedUser.kycDocuments.addressProof}`} 
                            alt="Address Proof" 
                            className="img-fluid" 
                            style={{ maxHeight: '200px' }}
                            onError={(e) => {e.target.onerror = null; e.target.src='/images/document-placeholder.png'}}
                          />
                        ) : (
                          <div className="py-5">
                            <i className="fas fa-file-image text-warning mb-2" style={{ fontSize: '3rem' }}></i>
                            <p>No address proof uploaded</p>
                          </div>
                        )}
                      </div>
                      <div className="card-footer bg-dark border-warning">
                        {selectedUser.kycDocuments?.addressProof && (
                          <a href={`http://localhost:5000${selectedUser.kycDocuments.addressProof}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="btn btn-sm btn-warning w-100">
                            <i className="fas fa-search-plus me-1"></i> View Full Size
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card bg-dark border-warning h-100">
                      <div className="card-header bg-dark border-warning">
                        <h6 className="mb-0">Selfie</h6>
                      </div>
                      <div className="card-body text-center">
                        {selectedUser.kycDocuments?.selfie ? (
                          <img 
                            src={`http://localhost:5000${selectedUser.kycDocuments.selfie}`} 
                            alt="Selfie" 
                            className="img-fluid" 
                            style={{ maxHeight: '200px' }}
                            onError={(e) => {e.target.onerror = null; e.target.src='/images/profile-placeholder.png'}}
                          />
                        ) : (
                          <div className="py-5">
                            <i className="fas fa-user text-warning mb-2" style={{ fontSize: '3rem' }}></i>
                            <p>No selfie uploaded</p>
                          </div>
                        )}
                      </div>
                      <div className="card-footer bg-dark border-warning">
                        {selectedUser.kycDocuments?.selfie && (
                          <a href={`http://localhost:5000${selectedUser.kycDocuments.selfie}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="btn btn-sm btn-warning w-100">
                            <i className="fas fa-search-plus me-1"></i> View Full Size
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-dark border-warning">
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <button type="button" className="btn btn-outline-light" onClick={() => setReviewModalOpen(false)}>
                      Close
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-warning" onClick={() => openResubmitModal(selectedUser)}>
                      <i className="fas fa-redo me-1"></i> Request Resubmission
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => openRejectModal(selectedUser)}>
                      <i className="fas fa-times me-1"></i> Reject
                    </button>
                    <button type="button" className="btn btn-success" onClick={() => handleApproveKyc(selectedUser._id)}>
                      <i className="fas fa-check me-1"></i> Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Reject or Resubmit) */}
      {modalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-warning">
              <div className="modal-header bg-dark border-warning">
                <h5 className="modal-title text-warning">
                  {modalType === 'reject' ? 'Reject KYC' : 'Request Resubmission'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  {modalType === 'reject' 
                    ? `You are about to reject KYC verification for ${selectedUser?.firstName} ${selectedUser?.lastName}.`
                    : `You are requesting ${selectedUser?.firstName} ${selectedUser?.lastName} to resubmit their KYC documents.`
                  }
                </p>
                <div className="mb-3">
                  <label htmlFor="reasonText" className="form-label">
                    {modalType === 'reject' ? 'Rejection Reason' : 'Resubmission Instructions'}
                  </label>
                  <textarea
                    className="form-control bg-dark text-white border-warning"
                    id="reasonText"
                    rows="3"
                    value={modalType === 'reject' ? rejectionReason : resubmissionMessage}
                    onChange={(e) => modalType === 'reject' 
                      ? setRejectionReason(e.target.value) 
                      : setResubmissionMessage(e.target.value)
                    }
                    placeholder={modalType === 'reject' 
                      ? 'Provide a reason for rejection' 
                      : 'Provide specific instructions for resubmission'
                    }
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer bg-dark border-warning">
                <button type="button" className="btn btn-outline-light" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={`btn ${modalType === 'reject' ? 'btn-danger' : 'btn-warning'}`}
                  onClick={modalType === 'reject' ? handleRejectKyc : handleRequestResubmission}
                >
                  {modalType === 'reject' ? 'Reject KYC' : 'Request Resubmission'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 