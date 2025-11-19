import React from 'react';
import './PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    
    // Calculate strength
    if (checks.length) strength += 20;
    if (checks.lowercase) strength += 20;
    if (checks.uppercase) strength += 20;
    if (checks.number) strength += 20;
    if (checks.special) strength += 20;
    
    // Determine label and color
    let label = '';
    let color = '';
    
    if (strength <= 20) {
      label = 'Very Weak';
      color = '#ff4444';
    } else if (strength <= 40) {
      label = 'Weak';
      color = '#ff9800';
    } else if (strength <= 60) {
      label = 'Fair';
      color = '#ffc107';
    } else if (strength <= 80) {
      label = 'Good';
      color = '#8bc34a';
    } else {
      label = 'Strong';
      color = '#4caf50';
    }
    
    return { strength, label, color, checks };
  };
  
  const { strength, label, color, checks } = calculateStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="password-strength-indicator">
      <div className="strength-bar-container">
        <div 
          className="strength-bar" 
          style={{ 
            width: `${strength}%`, 
            backgroundColor: color,
            transition: 'all 0.3s ease'
          }}
        />
      </div>
      <div className="strength-info">
        <span className="strength-label" style={{ color }}>
          {label}
        </span>
        <div className="strength-requirements">
          <span className={checks?.length ? 'met' : 'unmet'}>
            {checks?.length ? '✓' : '○'} 8+ characters
          </span>
          <span className={checks?.uppercase ? 'met' : 'unmet'}>
            {checks?.uppercase ? '✓' : '○'} Uppercase
          </span>
          <span className={checks?.lowercase ? 'met' : 'unmet'}>
            {checks?.lowercase ? '✓' : '○'} Lowercase
          </span>
          <span className={checks?.number ? 'met' : 'unmet'}>
            {checks?.number ? '✓' : '○'} Number
          </span>
          <span className={checks?.special ? 'met' : 'unmet'}>
            {checks?.special ? '✓' : '○'} Special char
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
