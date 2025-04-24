import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-warning mb-3">GoldInvest</h5>
            <p className="mb-0">
              A secure platform for investing in gold. Build your wealth with the
              world's most reliable precious metal.
            </p>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="text-warning mb-3">Links</h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link p-0 text-white">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/about" className="nav-link p-0 text-white">
                  About
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard" className="nav-link p-0 text-white">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/login" className="nav-link p-0 text-white">
                  Login
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/register" className="nav-link p-0 text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 className="text-warning mb-3">Legal</h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/terms" className="nav-link p-0 text-white">
                  Terms of Service
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/privacy" className="nav-link p-0 text-white">
                  Privacy Policy
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/cookies" className="nav-link p-0 text-white">
                  Cookie Policy
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/disclaimer" className="nav-link p-0 text-white">
                  Investment Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h6 className="text-warning mb-3">Contact</h6>
            <p className="mb-1">Email: support@goldinvest.com</p>
            <p className="mb-1">Phone: +1 (555) 123-4567</p>
            <p className="mb-3">Address: 123 Gold St, New York, NY 10001</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-warning">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-warning">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-warning">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-warning">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-4 border-warning" />
        
        <div className="row">
          <div className="col text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} GoldInvest. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 