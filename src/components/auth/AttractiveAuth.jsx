import React from 'react';
import './AttractiveAuth.css';

const AttractiveAuth = ({ title, children }) => {
  return (
    <div className="attractive-auth-container">
      <div className="attractive-auth-form">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AttractiveAuth;
