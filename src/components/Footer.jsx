import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiSend } from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-about">
            <h3 className="footer-logo">VegRuit</h3>
            <p>Your daily source of farm-fresh goodness. We connect you with local farmers to bring the best of nature to your table.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#farmers">Our Farmers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
            </div>
          </div>
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest deals and seasonal offers.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit" aria-label="Subscribe"><FiSend /></button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} VegRuit. All Rights Reserved. | Designed with ❤️ by Aadarsha Babu Dhakal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
