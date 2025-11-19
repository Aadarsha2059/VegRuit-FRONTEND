import React, { useEffect, useRef } from 'react';
import './AnimatedHomepageBackground.css';

const AnimatedHomepageBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = ['green', 'orange', 'yellow'];
    const particleCount = 30;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `dust-particle ${colors[Math.floor(Math.random() * colors.length)]}`;
      
      // Random size between 20px and 80px
      const size = Math.random() * 60 + 20;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random horizontal position
      particle.style.left = `${Math.random() * 100}%`;
      
      // Random animation duration between 15s and 30s
      const duration = Math.random() * 15 + 15;
      particle.style.animationDuration = `${duration}s`;
      
      // Random delay
      particle.style.animationDelay = `${Math.random() * 10}s`;
      
      // Random horizontal drift
      const drift = (Math.random() - 0.5) * 200;
      particle.style.setProperty('--drift', `${drift}px`);
      
      container.appendChild(particle);
    }

    // Cleanup
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="animated-homepage-background" />;
};

export default AnimatedHomepageBackground;
