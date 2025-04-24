import React from 'react';

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-border spinner-gold" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner; 