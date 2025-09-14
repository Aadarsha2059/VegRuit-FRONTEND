import React, { useState, useEffect } from 'react';
import './NepaliWelcomeDialog.css';

const NepaliWelcomeDialog = ({ isOpen, onClose, onSkipForSession, user, animationClass }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "स्वागत छ VegRuit मा! ",
      content: `नमस्कार ${user?.name || 'किसान साथी'}! तपाईंलाई VegRuit प्लेटफर्ममा स्वागत छ। यो तपाईंको फार्मबाट सिधै ग्राहकहरूसम्म पुग्ने सबैभन्दा राम्रो तरिका हो।`,
      icon: ""
    },
    {
      title: "VegRuit के हो? ",
      content: "VegRuit एक डिजिटल बजार हो जहाँ तपाईं आफ्ना ताजा फलफूल र तरकारीहरू सिधै बेच्न सक्नुहुन्छ। यहाँ कुनै बिचौलिया छैन, सबै नाफा तपाईंको!",
      icon: ""
    },
    {
      title: "उत्पादन कसरी थप्ने? ",
      content: "१. 'Categories' मा जानुहोस्\n२. नयाँ category बनाउनुहोस्\n३. 'Products' मा आफ्ना सामानहरू थप्नुहोस्\n४. फोटो र मूल्य राख्नुहोस्",
      icon: ""
    },
    {
      title: "गुणस्तर राख्नुहोस् ",
      content: "• सधैं ताजा र स्वच्छ सामान बेच्नुहोस्\n• सही तौल र मापदण्ड राख्नुहोस्\n• ग्राहकसँग इमानदारीपूर्वक व्यवहार गर्नुहोस्\n• समयमै डेलिभरी गर्नुहोस्",
      icon: ""
    },
    {
      title: "नाफा र वफादारी ",
      content: "राम्रो सेवाले तपाईंलाई:\n• नियमित ग्राहकहरू दिन्छ\n• बढी मूल्यमा बेच्न मद्दत गर्छ\n• समुदायमा राम्रो नाम कमाउँछ\n• आम्दानी बढाउँछ",
      icon: ""
    },
    {
      title: "सफलताका सुझावहरू ",
      content: "• नियमित रूपमा नयाँ उत्पादनहरू थप्नुहोस्\n• मौसमी फलफूलको फाइदा उठाउनुहोस्\n• ग्राहकको प्रतिक्रिया सुन्नुहोस्\n• सामाजिक सञ्जालमा साझा गर्नुहोस्",
      icon: ""
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setCurrentStep(1);
    }, 300);
  };

  const handleSkipSession = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkipForSession();
      setCurrentStep(1);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`nepali-dialog-overlay ${animationClass || ''} ${isVisible ? 'visible' : ''}`}>
      <div className="nepali-dialog-container">
        <div className="nepali-dialog-header">
          <div className="dialog-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <span className="step-indicator">{currentStep} / {steps.length}</span>
          </div>
          <div className="dialog-controls">
            <button 
              className="skip-session-btn" 
              onClick={handleSkipSession}
              title="यस सत्रको लागि लुकाउनुहोस्"
            >
              ⏭️
            </button>
            <button 
              className="close-btn" 
              onClick={handleClose}
              title="बन्द गर्नुहोस्"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="nepali-dialog-content">
          <div className="step-icon">
            {steps[currentStep - 1].icon}
          </div>
          <h2 className="step-title">
            {steps[currentStep - 1].title}
          </h2>
          <div className="step-content">
            {steps[currentStep - 1].content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        <div className="nepali-dialog-footer">
          <div className="step-dots">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index + 1)}
              />
            ))}
          </div>
          
          <div className="dialog-actions">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={prevStep}>
                ← अघिल्लो
              </button>
            )}
            
            {currentStep < steps.length ? (
              <button className="btn-primary" onClick={nextStep}>
                अर्को →
              </button>
            ) : (
              <div className="final-actions">
                <button className="btn-secondary" onClick={handleSkipSession}>
                  यस सत्रको लागि नदेखाउनुहोस्
                </button>
                <button className="btn-primary" onClick={handleClose}>
                  सुरु गरौं! 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NepaliWelcomeDialog;
