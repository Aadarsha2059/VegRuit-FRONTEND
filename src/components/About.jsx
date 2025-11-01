import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiHeart, FiUsers, FiAward } from 'react-icons/fi';
import aadarshaImage from '../assets/aadarsha.png';
import '../styles/About.css';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header">
          <h2>Our Story & Mission</h2>
          <p>Rooted in community, growing for a healthier future.</p>
        </div>

        <motion.div className="about-grid" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="about-text">
            <h3>From a Simple Idea to a Fresh Revolution</h3>
            <p>
              Our journey began with a simple yet powerful idea: to connect the hardworking farmers of the Kathmandu Valley directly with you. We envisioned a community where fresh, sustainably grown produce is not a luxury, but a daily reality.
            </p>
            <p>
              Today, we are proud to be that bridge. We partner with local farming families, ensuring they receive fair compensation for their dedication, while you receive produce that is bursting with flavor and nutrients. It's a cycle of goodness, and you're at the heart of it.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop" alt="Fresh vegetables" />
          </div>
        </motion.div>

        <motion.div className="values-grid" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <div className="value-card">
            <FiZap className="value-icon" />
            <h4>Directly Sourced</h4>
            <p>Harvested at peak freshness and delivered from the farm to your table, often within hours.</p>
          </div>
          <div className="value-card">
            <FiHeart className="value-icon" />
            <h4>Community Focused</h4>
            <p>Every purchase supports local farmers, strengthens our community, and promotes sustainable practices.</p>
          </div>
          <div className="value-card">
            <FiUsers className="value-icon" />
            <h4>Customer First</h4>
            <p>Your satisfaction is our priority. We are committed to providing exceptional quality and service.</p>
          </div>
          <div className="value-card">
            <FiAward className="value-icon" />
            <h4>Uncompromising Quality</h4>
            <p>We hand-select the best produce, ensuring every item meets our high standards of excellence.</p>
          </div>
        </motion.div>

        <motion.div className="team-card" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="team-image">
            <img src={aadarshaImage} alt="Aadarsha Babu Dhakal" />
          </div>
          <div className="team-info">
            <h3>Meet the Founder</h3>
            <h4>Aadarsha Babu Dhakal</h4>
            <p>"I started this journey to bring the authentic taste of my homeland's soil to every home. It's more than a business; it's a passion for fresh food and a commitment to our community's well-being."</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
