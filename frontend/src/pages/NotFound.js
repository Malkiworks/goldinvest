import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card bg-dark text-white border-warning">
            <div className="card-body p-5">
              <div className="text-warning display-1 mb-4">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h1 className="text-warning mb-4">404 - Page Not Found</h1>
              <p className="lead mb-4">
                The page you are looking for doesn't exist or has been moved.
              </p>
              <Link to="/" className="btn btn-warning btn-lg">
                <i className="fas fa-home me-2"></i>Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 