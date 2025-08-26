import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({ user, onLogout, onLoginClick, onSignUpClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    onLogout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
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
            {user ? (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    className="nav-link login-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button 
                    className="nav-link login-btn"
                    onClick={() => {
                      onLoginClick()
                      setIsMenuOpen(false)
                    }}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button 
                    className="nav-link signup-btn"
                    onClick={() => {
                      onSignUpClick()
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </header>
  )
}

export default Header
