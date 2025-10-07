import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      {/* Back to Home Button - Positioned at top right */}
      <Link to="/" className="back-button top-right">
        <span className="back-icon">←</span>
        Back to Home
      </Link>
      
      {/* Hero Section */}
      <section className="auth-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to VegRuit</h1>
            <p className="hero-subtitle">
              Join thousands of farmers and customers in Nepal's freshest marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Auth Options Section */}
      <section className="auth-options">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get Started</h2>
            <p className="section-subtitle">Choose how you want to use VegRuit</p>
          </div>
          
          <div className="auth-cards">
            {/* Buyer Card */}
            <div className="auth-card buyer-card">
              <div className="card-icon">🛒</div>
              <h3>Buy Fresh Produce</h3>
              <p>Shop for the freshest fruits and vegetables from local farmers</p>
              <ul className="features-list">
                <li>✓ Browse thousands of products</li>
                <li>✓ Fast delivery to your doorstep</li>
                <li>✓ Secure payment options</li>
                <li>✓ Track your orders</li>
              </ul>
              <div className="card-buttons">
                <Link to="/buyer-login" className="btn btn-primary">
                  Login as Buyer
                </Link>
                <Link to="/buyer-signup" className="btn btn-secondary">
                  Sign Up as Buyer
                </Link>
              </div>
            </div>

            {/* Seller Card */}
            <div className="auth-card seller-card">
              <div className="card-icon">🌱</div>
              <h3>Sell Your Produce</h3>
              <p>Sell your fresh produce directly to customers</p>
              <ul className="features-list">
                <li>✓ Create your own store</li>
                <li>✓ Manage your inventory</li>
                <li>✓ Process customer orders</li>
                <li>✓ Track your earnings</li>
              </ul>
              <div className="card-buttons">
                <Link to="/seller-login" className="btn btn-primary">
                  Login as Seller
                </Link>
                <Link to="/seller-signup" className="btn btn-secondary">
                  Sign Up as Seller
                </Link>
              </div>
            </div>

            {/* Both Card */}
            <div className="auth-card both-card">
              <div className="card-icon">🌟</div>
              <h3>Be Both Buyer & Seller</h3>
              <p>Enjoy the best of both worlds - shop and sell on VegRuit</p>
              <ul className="features-list">
                <li>✓ Access to both dashboards</li>
                <li>✓ Special dual-role benefits</li>
                <li>✓ Flexible role switching</li>
                <li>✓ Exclusive community access</li>
              </ul>
              <div className="card-buttons">
                <Link to="/auth" className="btn btn-primary" onClick={() => alert('For dual roles, please sign up as either buyer or seller first, then contact support to add the second role.')}>
                  Sign Up for Both
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple steps to get started</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Your Role</h3>
              <p>Select if you want to buy, sell, or both</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Create Account</h3>
              <p>Sign up with your details</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Start Using</h3>
              <p>Begin shopping or selling immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="auth-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Join Nepal's leading fresh produce marketplace today
            </p>
            <Link to="/buyer-signup" className="cta-button">
              Create Account Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;