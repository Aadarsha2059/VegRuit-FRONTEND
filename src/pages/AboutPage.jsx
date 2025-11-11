import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import aadarshaImage from '../assets/aadarsha.png';
import '../styles/AboutPage.css';

const AboutPage = () => {
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
  const developer = {
    name: "Aadarsha Babu Dhakal",
    role: "Founder & Full-Stack Developer",
    image: aadarshaImage,
    description: "Individual developer passionate about connecting farmers with consumers through technology. Built this entire marketplace platform from scratch in 2025.",
    skills: ["React", "Node.js", "MongoDB", "Express", "Full-Stack Development"],
    email: "contact@vegruit.com",
    linkedin: "#",
    github: "#"
  };

  const values = [
    {
      icon: "🌱",
      title: "Fresh & Organic",
      description: "We prioritize fresh, organic produce directly from local farms"
    },
    {
      icon: "🤝",
      title: "Fair Trade",
      description: "Ensuring fair prices for farmers and affordable rates for customers"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep"
    },
    {
      icon: "💚",
      title: "Sustainable",
      description: "Supporting sustainable farming practices and environmental protection"
    }
  ];

  const milestones = [
    { year: "2025", event: "VegRuit platform developed and launched" },
    { year: "2025", event: "Built complete marketplace with React & Node.js" },
    { year: "2025", event: "Integrated secure authentication and payment systems" },
    { year: "2025", event: "Launched with modern UI/UX and responsive design" }
  ];

  return (
    <motion.div 
      className="about-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <motion.section className="about-hero" variants={fadeInUp}>
        <div className="hero-overlay">
          <div className="hero-content">
            <BackButton />
            <motion.h1 className="hero-title" variants={fadeInUp}>
              About TarkariShop
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              Connecting Nepal's farmers with fresh food lovers since 2020
            </motion.p>
            <motion.div className="hero-cta" variants={fadeInUp}>
              <Link to="/explore" className="hero-button primary">
                Explore Products
              </Link>
              <Link to="/contact" className="hero-button secondary">
                Get in Touch
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section className="story-section" variants={fadeInUp}>
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Our Story</h2>
            <p className="section-subtitle">How we started and where we're going</p>
          </motion.div>
          <motion.div className="story-content" variants={staggerContainer}>
            <motion.div className="story-text" variants={fadeInUp}>
              <p>
                VegRuit was developed in 2025 as a modern solution to bridge the gap between Nepal's hardworking farmers 
                and urban consumers who value fresh, quality produce. Built from the ground up by an individual developer 
                passionate about technology and sustainable agriculture, this platform aims to help local farmers reach 
                more customers while providing city dwellers with access to the freshest vegetables and fruits.
              </p>
              <p>
                This full-stack marketplace platform leverages modern web technologies including React, Node.js, 
                MongoDB, and Express to create a seamless experience for both buyers and sellers. The platform 
                features secure authentication, real-time inventory management, integrated payment systems, 
                and a responsive design that works beautifully on all devices.
              </p>
              <p>
                The mission goes beyond just creating a marketplace. This project represents a commitment to 
                building sustainable technology solutions that can empower farmers, delight customers, and 
                contribute to a healthier, more connected Nepal.
              </p>
              <motion.div className="story-highlight" variants={fadeInUp}>
                <blockquote>
                  "Building technology that connects people, supports local communities, and makes fresh, healthy food accessible to everyone."
                </blockquote>
                <cite>- Aadarsha Babu Dhakal, Developer & Founder</cite>
              </motion.div>
            </motion.div>
            <motion.div className="story-image" variants={fadeInUp}>
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop" 
                alt="Farmers in Nepal"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section className="values-section" variants={fadeInUp}>
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">Principles that guide everything we do</p>
          </motion.div>
          <motion.div className="values-grid" variants={staggerContainer}>
            {values.map((value, index) => (
              <motion.div key={index} className="value-card" variants={fadeInUp}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Developer Section */}
      <motion.section className="team-section developer-section" variants={fadeInUp}>
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Meet the Developer</h2>
            <p className="section-subtitle">The individual behind VegRuit</p>
          </motion.div>
          <motion.div className="developer-card-wrapper" variants={fadeInUp}>
            <div className="developer-card">
              <div className="developer-image">
                <img src={developer.image} alt={developer.name} />
              </div>
              <div className="developer-info">
                <h3>{developer.name}</h3>
                <p className="developer-role">{developer.role}</p>
                <p className="developer-description">{developer.description}</p>
                <div className="developer-skills">
                  <h4>Tech Stack:</h4>
                  <div className="skills-tags">
                    {developer.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="developer-contact">
                  <a href={`mailto:${developer.email}`} className="contact-link">
                    📧 {developer.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">Milestones in our growth</p>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <p>{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">By The Numbers</h2>
            <p className="section-subtitle">Our impact so far</p>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">2025</span>
              <span className="stat-label">Year Developed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Custom Built</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Full-Stack</span>
              <span className="stat-label">MERN Platform</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1</span>
              <span className="stat-label">Dedicated Developer</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Mission</h2>
            <p>
              Be part of Nepal's fresh food revolution. Whether you're a farmer looking to reach more customers 
              or a consumer seeking the freshest produce, VegRuit is here for you.
            </p>
            <div className="cta-buttons">
              <Link to="/explore" className="cta-button primary">
                Start Shopping
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;