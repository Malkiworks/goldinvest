import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-gold">
      <div className="container">
        <Link to="/" className="navbar-brand text-warning">
          GoldInvest
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
                {user?.kycStatus !== 'approved' && (
                  <li className="nav-item">
                    <Link to="/kyc" className="nav-link">
                      KYC Verification
                    </Link>
                  </li>
                )}
              </ul>
              <div className="d-flex">
                <span className="navbar-text me-3">
                  Welcome, {user?.firstName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-warning"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
              </ul>
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-warning me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-warning">
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 