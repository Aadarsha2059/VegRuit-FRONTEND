import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import BackButton from '../components/BackButton';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Thank you for your message! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Location',
      details: ['Kathmandu, Nepal', 'Serving nationwide']
    },
    {
      icon: '👨‍💻',
      title: 'Developer',
      details: ['Aadarsha Babu Dhakal', 'Individual Full-Stack Developer']
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['contact@vegruit.com', 'Built in 2025']
    },
    {
      icon: '💻',
      title: 'Tech Stack',
      details: ['React • Node.js • MongoDB', 'Express • Full MERN Stack']
    }
  ];

  const faqs = [
    {
      question: 'Who developed VegRuit?',
      answer: 'VegRuit was developed by Aadarsha Babu Dhakal, an individual full-stack developer, in 2025. The entire platform was built from scratch using modern web technologies.'
    },
    {
      question: 'What technologies power this platform?',
      answer: 'VegRuit is built using the MERN stack (MongoDB, Express.js, React, Node.js) with additional features like secure authentication, payment integration, and responsive design.'
    },
    {
      question: 'Is this a real marketplace?',
      answer: 'VegRuit is a fully functional marketplace platform designed to connect farmers with consumers. It features complete buyer and seller dashboards, product management, cart functionality, and order processing.'
    },
    {
      question: 'Can I contribute or provide feedback?',
      answer: 'Absolutely! Feedback and suggestions are always welcome. Feel free to reach out through the contact form above or via email.'
    }
  ];

  return (
    <motion.div 
      className="contact-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <motion.section className="contact-hero" variants={fadeInUp}>
        <div className="hero-overlay">
          <div className="hero-content">
            <BackButton />
            <motion.h1 className="hero-title" variants={fadeInUp}>
              Get in Touch
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
            <motion.div className="hero-cta" variants={fadeInUp}>
              <Link to="/explore" className="hero-button primary">
                Explore Products
              </Link>
              <Link to="/about" className="hero-button secondary">
                About Us
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Form & Info Section */}
      <section className="contact-main">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">We're here to help and answer any questions you might have</p>
          </div>
          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>Contact Information</h2>
              <div className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-info-card">
                    <div className="info-icon">{info.icon}</div>
                    <div className="info-content">
                      <h3>{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="map-section">
                <h3>Find Us</h3>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1234567890123!2d85.31234567890123!3d27.71234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzQ0LjQiTiA4NcKwMTgnNDQuNCJF!5e0!3m2!1sen!2snp!4v1234567890123!5m2!1sen!2snp"
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: '15px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="VegRuit Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find answers to common questions</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>
              Browse our fresh collection of fruits and vegetables from local farmers across Nepal.
            </p>
            <div className="cta-buttons">
              <Link to="/explore" className="cta-button primary">
                Explore Products
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;