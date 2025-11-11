import React from 'react';
import './AttractiveAuth.css';

const AttractiveAuth = ({ title, subtitle, icon, role, children }) => {
  return (
    <div className={`attractive-auth-container ${role ? `${role}-theme` : ''}`}>
      <div className="attractive-auth-form">
        <div className="auth-header">
          {icon && <div className="auth-icon">{icon}</div>}
          <h2>{title}</h2>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
      <div className="auth-illustration">
        <div className="illustration-content">
          {role === 'buyer' ? (
            <>
              <div className="floating-veggie veggie-1">🥕</div>
              <div className="floating-veggie veggie-2">🥬</div>
              <div className="floating-veggie veggie-3">🍅</div>
              <div className="floating-veggie veggie-4">🥦</div>
              <div className="floating-veggie veggie-5">🌽</div>
            </>
          ) : (
            <>
              <div className="floating-veggie veggie-1">🌾</div>
              <div className="floating-veggie veggie-2">🍊</div>
              <div className="floating-veggie veggie-3">🥕</div>
              <div className="floating-veggie veggie-4">🍇</div>
              <div className="floating-veggie veggie-5">🥬</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractiveAuth;
