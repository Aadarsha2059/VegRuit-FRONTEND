// src/components/auth/MainAuth.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authAPI, AUTH_STATUS } from '../../services/authAPI';


// Reusable UI Components
const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`${children ? 'mr-2' : ''} h-4 w-4`} />}
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  icon: Icon, 
  error,
  className = '', 
  ...props 
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`
          block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border 
          ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-md shadow-sm focus:outline-none focus:ring-2 
          focus:ring-primary-500 focus:border-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  </div>
);

const TermsModal = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Terms and Conditions</h3>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose max-w-none">
            <h4>Last Updated: October 14, 2025</h4>
            
            <h5>1. Acceptance of Terms</h5>
            <p>
              By accessing or using our platform, you agree to be bound by these terms and conditions. 
              If you do not agree, please do not use our services.
            </p>

            <h5>2. User Responsibilities</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h5>3. Privacy Policy</h5>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your personal information.
            </p>

            <h5>4. Service Modifications</h5>
            <p>
              We reserve the right to modify or discontinue the service at any time without notice. 
              We shall not be liable for any modification, suspension, or discontinuance of the service.
            </p>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={onDecline}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Decline
          </Button>
          <Button 
            variant="primary"
            onClick={onAccept}
            className="min-w-[120px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            I Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

const MainAuth = ({ 
  onAuthSuccess, 
  onClose, 
  initialAuthMode = 'login', 
  initialUserType = 'buyer',
  redirectPath = null
}) => {
  const [authMode, setAuthMode] = useState(initialAuthMode);
  const [userType, setUserType] = useState(initialUserType);
  const [authStatus, setAuthStatus] = useState(AUTH_STATUS.LOADING);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle tab switching between buyer and seller
  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Reset form errors when switching user types
    setErrors({});
  };

  // ... (rest of your existing code)

  const handleAuthSuccess = async (userData) => {
    // If it's a login or terms already accepted, proceed directly
    if (authMode === 'login' || acceptedTerms) {
      completeAuth(userData);
      return;
    }
    
    // For signup, show terms modal
    setShowTermsModal(true);
    // Store user data temporarily
    sessionStorage.setItem('pendingUser', JSON.stringify(userData));
  };

  const completeAuth = (userData) => {
    onAuthSuccess?.(userData);
    onClose?.();
    
    const redirectTo = redirectPath || 
      (userData.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
    navigate(redirectTo, { replace: true });
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    const userData = JSON.parse(sessionStorage.getItem('pendingUser'));
    sessionStorage.removeItem('pendingUser');
    setShowTermsModal(false);
    
    if (userData) {
      completeAuth({
        ...userData,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString()
      });
    }
  };

  const handleDeclineTerms = () => {
    sessionStorage.removeItem('pendingUser');
    setShowTermsModal(false);
    toast.error('You must accept the terms and conditions to continue');
  };
  
  const handleCheckboxChange = (e) => {
    setAcceptedTerms(e.target.checked);
    if (errors.acceptTerms) {
      setErrors(prev => ({
        ...prev,
        acceptTerms: null
      }));
    }
  };

  // ... (rest of your existing code)

  return (
    <>
      {/* Your existing component JSX */}
      
      {/* Terms and Conditions Modal */}
      <TermsModal 
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
      
      {/* Terms Acceptance Checkbox in Signup Form */}
      {authMode === 'signup' && (
        <div className="mt-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={handleCheckboxChange}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                I agree to the{' '}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Terms and Conditions
                </button>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainAuth;