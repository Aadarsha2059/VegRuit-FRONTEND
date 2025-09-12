import React from 'react'
import '../styles/About.css'
import aadarshaImage from '../assets/aadarsha.png'

const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Customers', icon: '😊' },
    { number: '50+', label: 'Local Farmers', icon: '👨‍🌾' },
    { number: '100+', label: 'Product Varieties', icon: '🥬' },
    { number: '24/7', label: 'Customer Support', icon: '📞' }
  ]

  const values = [
    {
      icon: '🌱',
      title: 'Freshness Guaranteed',
      description: 'We ensure all our produce is harvested fresh and delivered to your doorstep within hours.'
    },
    {
      icon: '👨‍🌾',
      title: 'Support Local Farmers',
      description: 'We work directly with local farmers to provide them fair prices and support their livelihoods.'
    },
    {
      icon: '🌍',
      title: 'Eco-Friendly',
      description: 'Our packaging is eco-friendly and we promote sustainable farming practices.'
    },
    {
      icon: '💚',
      title: 'Quality Assured',
      description: 'Every product goes through quality checks to ensure you get the best fresh produce.'
    }
  ]

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header">
          <h2>About VegRuit</h2>
          <p>Connecting local farmers with urban consumers for fresh, healthy produce</p>
        </div>

        <div className="about-content">
          <div className="about-story">
            <div className="story-text">
              <h3>Our Story</h3>
              <p>
                VegRuit was born from a simple idea: to bridge the gap between local farmers in Kathmandu Valley 
                and urban consumers who crave fresh, organic produce. Founded in 2024, we started as a small 
                initiative to support local farmers while providing city dwellers with access to the freshest 
                fruits and vegetables.
              </p>
              <p>
                Today, we're proud to serve thousands of customers across Kathmandu, working with over 50 
                local farmers who share our commitment to quality and sustainability. Our mission is to 
                make fresh, organic produce accessible to everyone while supporting the local farming community.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">🥬</span>
                <p>Fresh from Farm to Table</p>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3>Our Impact</h3>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="values-section">
            <h3>Our Values</h3>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="team-section">
            <h3>Meet Our Team</h3>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">
                  <img src={aadarshaImage} alt="Aadarsha Babu Dhakal" />
                </div>
                <h4>Aadarsha Babu Dhakal</h4>
                <p>Founder & CEO</p>
                <p className="member-description">
                  Passionate about connecting farmers with consumers and promoting sustainable agriculture. 
                  Leading VegRuit's mission to revolutionize fresh produce delivery in Kathmandu Valley.
                </p>
                <div className="member-social">
                  <a href="#" className="social-link">💼 LinkedIn</a>
                  <a href="#" className="social-link">📧 Email</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mission-section">
            <div className="mission-content">
              <h3>Our Mission</h3>
              <p>
                To revolutionize the way people access fresh produce by creating a direct bridge between 
                local farmers and consumers, ensuring quality, freshness, and fair prices for everyone 
                involved in the process.
              </p>
              <div className="mission-points">
                <div className="mission-point">
                  <span className="point-icon">✅</span>
                  <span>Support local farmers with fair prices</span>
                </div>
                <div className="mission-point">
                  <span className="point-icon">✅</span>
                  <span>Provide fresh, organic produce to consumers</span>
                </div>
                <div className="mission-point">
                  <span className="point-icon">✅</span>
                  <span>Promote sustainable farming practices</span>
                </div>
                <div className="mission-point">
                  <span className="point-icon">✅</span>
                  <span>Build a stronger local food ecosystem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
