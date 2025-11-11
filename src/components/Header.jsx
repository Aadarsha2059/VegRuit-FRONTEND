import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({ user, onLogout, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const authModalRef = useRef(null)
  
  // Hide user menu on auth pages and homepage
  const isAuthPage = location.pathname.includes('login') || location.pathname.includes('signup')
  const isHomePage = location.pathname === '/'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openAuthModal = () => {
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      navigate('/')
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authModalRef.current && !authModalRef.current.contains(event.target)) {
        closeAuthModal()
      }
    }

    if (isAuthModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable background scrolling when modal is closed
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isAuthModalOpen])

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>VegRuit</h1>
            <span className="tagline">Fresh from Kathmandu</span>
          </Link>
        </div>
        
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {!isAuthPage ? (
            <button 
              className="nav-link login-btn"
              onClick={openAuthModal}
            >
              Login / Sign Up
            </button>
          ) : null}
        </div>
        
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>

      {/* Attractive Auth Modal */}
      {isAuthModalOpen && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-container" ref={authModalRef}>
            <div className="auth-modal-header">
              <h2>Get Started with VegRuit</h2>
              <button className="auth-modal-close" onClick={closeAuthModal}>
                ×
              </button>
            </div>
            
            <div className="auth-modal-content">
              <div className="auth-option-card">
                <div className="auth-option-icon">🛒</div>
                <h3>Buy Fresh Produce</h3>
                <p>Shop for the freshest fruits and vegetables from local farmers</p>
                <div className="auth-option-buttons">
                  <Link to="/buyer-login" className="btn btn-primary" onClick={closeAuthModal}>
                    Buyer Login
                  </Link>
                  <Link to="/buyer-signup" className="btn btn-secondary" onClick={closeAuthModal}>
                    Buyer Sign Up
                  </Link>
                </div>
              </div>
              
              <div className="auth-option-card">
                <div className="auth-option-icon">🌱</div>
                <h3>Sell Your Produce</h3>
                <p>Sell your fresh produce directly to customers</p>
                <div className="auth-option-buttons">
                  <Link to="/seller-login" className="btn btn-primary" onClick={closeAuthModal}>
                    Seller Login
                  </Link>
                  <Link to="/seller-signup" className="btn btn-secondary" onClick={closeAuthModal}>
                    Seller Sign Up
                  </Link>
                </div>
              </div>
              
              {/* Removed the combined Buyer & Seller option for a simpler auth dialog */}
            </div>
            
            <div className="auth-modal-footer">
              <p>Need help? <Link to="/contact" onClick={closeAuthModal}>Contact Support</Link></p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header