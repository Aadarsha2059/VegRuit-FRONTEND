import React, { useState, useEffect } from 'react';
import './PageTransitionLoader.css';

const PageTransitionLoader = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const duration = 1500; // 1.5 seconds
      const interval = 20; // Update every 20ms
      const increment = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return Math.min(prev + increment, 100);
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="page-transition-loader">
      <div className="loader-container">
        <svg className="circular-loader" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="50%" stopColor="#FF9800" />
              <stop offset="100%" stopColor="#4CAF50" />
            </linearGradient>
          </defs>
          <circle
            className="loader-bg"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          <circle
            className="loader-progress"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#loaderGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
            }}
          />
        </svg>
        <div className="loader-text">
          <span className="loader-percentage">{Math.round(progress)}%</span>
          <span className="loader-label">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default PageTransitionLoader;
