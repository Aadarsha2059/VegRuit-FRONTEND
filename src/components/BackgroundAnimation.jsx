import React from 'react';
import './BackgroundAnimation.css';

const BackgroundAnimation = () => {
  return (
    <div className="background-animation">
      <div className="floating-element fruit-1">🥬</div>
      <div className="floating-element fruit-2">🥕</div>
      <div className="floating-element fruit-3">🍅</div>
      <div className="floating-element fruit-4">🥒</div>
      <div className="floating-element fruit-5">🌶️</div>
      <div className="floating-element fruit-6">🥔</div>
      <div className="floating-element fruit-7">🧅</div>
      <div className="floating-element fruit-8">🥦</div>
      <div className="floating-element fruit-9">🌽</div>
      <div className="floating-element fruit-10">🍆</div>
      
      {/* Color bubbles */}
      <div className="color-bubble bubble-1"></div>
      <div className="color-bubble bubble-2"></div>
      <div className="color-bubble bubble-3"></div>
      <div className="color-bubble bubble-4"></div>
      <div className="color-bubble bubble-5"></div>
      <div className="color-bubble bubble-6"></div>
    </div>
  );
};

export default BackgroundAnimation;