import React from 'react'
import farmerOneImage from '../assets/farmer one.png'
import farmerTwoImage from '../assets/farmer two.png'
import '../styles/Farmers.css'

const Farmers = () => {
  const farmers = [
    {
      id: 1,
      name: 'Ram Bahadur Tamang',
      image: farmerOneImage,
      location: 'Lalitpur, Kathmandu Valley',
      specialty: 'Organic Vegetables',
      experience: '15+ years',
      story: 'Dedicated to growing the finest organic vegetables using traditional farming methods passed down through generations.'
    },
    {
      id: 2,
      name: 'Sita Devi Thapa',
      image: farmerTwoImage,
      location: 'Bhaktapur, Kathmandu Valley',
      specialty: 'Fresh Fruits',
      experience: '12+ years',
      story: 'Passionate about cultivating sweet and juicy fruits that bring joy to families across Kathmandu.'
    }
  ]

  return (
    <section className="farmers" id="about">
      <div className="container">
        <div className="section-header">
          <h2>Meet Our Local Farmers</h2>
          <p>Supporting the hardworking farmers of Kathmandu Valley</p>
        </div>

        <div className="farmers-grid">
          {farmers.map((farmer) => (
            <div key={farmer.id} className="farmer-card">
              <div className="farmer-image">
                <img src={farmer.image} alt={farmer.name} />
                <div className="farmer-badge">
                  <span>Local</span>
                  <span>Farmer</span>
                </div>
              </div>
              <div className="farmer-info">
                <h3>{farmer.name}</h3>
                <div className="farmer-details">
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>{farmer.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">🌾</span>
                    <span>{farmer.specialty}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">⏰</span>
                    <span>{farmer.experience}</span>
                  </div>
                </div>
                <p className="farmer-story">{farmer.story}</p>
                <button className="btn btn-outline">Learn More</button>
              </div>
            </div>
          ))}
        </div>

        <div className="farmers-message">
          <div className="message-content">
            <h3>Supporting Local Communities</h3>
            <p>
              By choosing VegRuit, you're not just getting fresh produce - you're supporting 
              local farmers and their families in the Kathmandu Valley. Every purchase helps 
              sustain traditional farming practices and strengthens our community.
            </p>
            <div className="stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Local Farmers</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Local Produce</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Farmers
