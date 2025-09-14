import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Ram Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Passionate about connecting farmers with consumers"
    },
    {
      name: "Sita Poudel",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "Ensuring quality and timely delivery"
    },
    {
      name: "Krishna Thapa",
      role: "Technology Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Building the future of online farming"
    },
    {
      name: "Aadarsha Babu Dhakal",
      role: "Lead Developer",
      image: "/images/aadarsha.png",
      description: "Full-stack developer who built this marketplace platform"
    },
    {
      name: "Maya Gurung",
      role: "Customer Relations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Dedicated to customer satisfaction"
    }
  ];

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
    { year: "2020", event: "VegRuit founded in Kathmandu" },
    { year: "2021", event: "Partnered with 50+ local farmers" },
    { year: "2022", event: "Expanded to 5 major cities" },
    { year: "2023", event: "Served 10,000+ happy customers" },
    { year: "2024", event: "Launched mobile app and AI recommendations" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <Link to="/" className="back-button">
              <span className="back-icon">←</span>
              Back to Home
            </Link>
            <h1 className="hero-title">About VegRuit</h1>
            <p className="hero-subtitle">
              Connecting Nepal's farmers with fresh food lovers since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                VegRuit was born from a simple idea: to bridge the gap between Nepal's hardworking farmers 
                and urban consumers who value fresh, quality produce. Founded in 2020 in the heart of Kathmandu, 
                we started as a small initiative to help local farmers reach more customers while providing 
                city dwellers with access to the freshest vegetables and fruits.
              </p>
              <p>
                What began as a weekend farmers' market has grown into Nepal's leading online marketplace 
                for fresh produce. We're proud to support over 500 local farmers across the country while 
                serving thousands of families with farm-fresh goodness delivered right to their doorstep.
              </p>
              <p>
                Our mission goes beyond just selling vegetables and fruits. We're building a sustainable 
                ecosystem that empowers farmers, delights customers, and contributes to a healthier Nepal.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop" 
                alt="Farmers in Nepal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
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
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Partner Farmers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Product Varieties</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Cities Served</span>
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
              <Link to="/" className="cta-button primary">
                Start Shopping
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
