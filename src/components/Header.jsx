import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({ user, onLogout, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleAuthClick = () => {
    if (onAuthClick) {
      onAuthClick()
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      navigate('/')
    }
  }

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
                to="/#explore" 
                className={`nav-link ${isActive('/#explore') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
            </li>
            <li>
              <Link 
                to="/#about" 
                className={`nav-link ${isActive('/#about') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/#contact" 
                className={`nav-link ${isActive('/#contact') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          <button
            className="nav-link login-btn"
            onClick={handleAuthClick}
          >
            Login / Sign Up
          </button>
        </div>
        
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </header>
  )
}

export default Header