import React from 'react'
import '../styles/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>VegRuit</h3>
              <p>Fresh from Kathmandu</p>
            </div>
            <p className="footer-description">
              Connecting you with the finest locally grown fruits and vegetables 
              from the heart of Kathmandu Valley. Supporting local farmers, 
              delivering fresh produce to your doorstep.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f">📘</i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram">📷</i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter">🐦</i>
              </a>
              <a href="#" className="social-link" aria-label="WhatsApp">
                <i className="fab fa-whatsapp">💬</i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#explore">Explore Products</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li>Fresh Fruits Delivery</li>
              <li>Organic Vegetables</li>
              <li>Local Farmer Support</li>
              <li>Same Day Delivery</li>
              <li>Quality Assurance</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="icon">📍</span>
                <span>Kathmandu Valley, Nepal</span>
              </div>
              <div className="contact-item">
                <span className="icon">📞</span>
                <span>+977-1-4XXXXXX</span>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <span>info@vegruit.com</span>
              </div>
              <div className="contact-item">
                <span className="icon">🕒</span>
                <span>Mon-Sat: 8AM-8PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} VegRuit. All rights reserved.</p>
            </div>
            <div className="developer-info">
              <p>
                Designed & Developed by{' '}
                <span className="developer-name">Aadarsha Babu Dhakal</span>
              </p>
              <p className="project-info">
                Module: UI/UX Design | Final Semester | Softwarica
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
