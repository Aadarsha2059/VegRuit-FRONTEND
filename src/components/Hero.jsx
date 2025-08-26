import React from 'react'
import basketImage from '../assets/basket.png'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="highlight">VegRuit</span>
            </h1>
            <p className="hero-subtitle">
              Fresh, Local, and Delicious Fruits & Vegetables
            </p>
            <p className="hero-description">
              Discover the finest selection of locally grown produce from the heart of Kathmandu. 
              Supporting local farmers while bringing you the freshest ingredients for your table.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Explore Products</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
          
          <div className="hero-image">
            <img src={basketImage} alt="Fresh fruits and vegetables basket" />
            <div className="floating-badge">
              <span>100%</span>
              <span>Fresh</span>
            </div>
          </div>
        </div>
        
        <div className="hero-features">
          <div className="feature">
            <div className="feature-icon">🌱</div>
            <h3>Locally Grown</h3>
            <p>Supporting Kathmandu farmers</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Same day delivery available</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✨</div>
            <h3>Premium Quality</h3>
            <p>Handpicked fresh produce</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
