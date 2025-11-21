import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NepaliWelcomeDialog.css';
import homepageSound from '../assets/sound/homepage_sound.mp3';

const NepaliWelcomeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Show dialog after 2-3 seconds (using 2.5 seconds as middle ground)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    // Initialize audio
    audioRef.current = new Audio(homepageSound);
    audioRef.current.volume = 1.0; // Full volume

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Play sound when dialog closes
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="nepali-welcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="nepali-welcome-dialog"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="nepali-close-btn" 
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Welcome Icon */}
            <div className="nepali-welcome-icon">
              🙏
            </div>

            {/* Welcome Message */}
            <h2 className="nepali-welcome-title">
              नमस्ते! VegRuit मा स्वागत छ
            </h2>
            <p className="nepali-welcome-subtitle">
              Welcome to VegRuit
            </p>

            {/* Description */}
            <div className="nepali-welcome-content">
              <p className="nepali-text">
                ताजा तरकारी र फलफूलको लागि नेपालको अग्रणी अनलाइन बजार
              </p>
              <p className="english-text">
                Nepal's leading online marketplace for fresh vegetables and fruits
              </p>
            </div>

            {/* Features */}
            <div className="nepali-features">
              <div className="feature-item">
                <span className="feature-icon">🌱</span>
                <span className="feature-text">ताजा उत्पादन</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">छिटो डेलिभरी</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💚</span>
                <span className="feature-text">गुणस्तरीय सेवा</span>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              className="nepali-explore-btn"
              onClick={handleClose}
            >
              अन्वेषण गर्नुहोस् • Explore Now
            </button>

            {/* Footer Note */}
            <p className="nepali-footer-note">
              Built with ❤️ in Nepal • 2025
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NepaliWelcomeDialog;
