import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiSun, FiDroplet, FiTrendingUp } from 'react-icons/fi';
import './FarmingRegionsPage.css';

const FarmingRegionsPage = () => {
  const [activeRegion, setActiveRegion] = useState(null);

  const regions = [
    {
      id: 1,
      name: 'Sindhuli District',
      icon: '🍊',
      specialty: 'Citrus Fruits',
      image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&h=600&fit=crop',
      description: 'Famous for its sweet and juicy oranges, mandarins, and lemons. The hilly terrain and climate create perfect conditions for citrus cultivation.',
      products: ['Oranges', 'Mandarins', 'Lemons', 'Sweet Lime'],
      climate: 'Subtropical',
      altitude: '300-2000m',
      bestSeason: 'November - February',
      farmingTech: 'Organic farming, Drip irrigation, Integrated pest management'
    },
    {
      id: 2,
      name: 'Jumla District',
      icon: '🍎',
      specialty: 'Premium Apples',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop',
      description: 'High-altitude apple orchards producing some of Nepal\'s finest apples. The cold climate and pristine environment result in crisp, flavorful fruits.',
      products: ['Red Delicious', 'Royal Gala', 'Fuji Apples', 'Wild Apples'],
      climate: 'Alpine/Cold',
      altitude: '2000-3000m',
      bestSeason: 'August - October',
      farmingTech: 'Cold storage facilities, Grafting techniques, Organic certification'
    },
    {
      id: 3,
      name: 'Terai Region',
      icon: '🥬',
      specialty: 'Fresh Vegetables',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
      description: 'The breadbasket of Nepal, producing a wide variety of vegetables year-round. Fertile plains and abundant water make it ideal for intensive farming.',
      products: ['Cauliflower', 'Cabbage', 'Tomatoes', 'Potatoes', 'Leafy Greens'],
      climate: 'Tropical/Subtropical',
      altitude: '60-300m',
      bestSeason: 'Year-round',
      farmingTech: 'Greenhouse farming, Mechanized agriculture, Crop rotation'
    },
    {
      id: 4,
      name: 'Bhaktapur District',
      icon: '🌾',
      specialty: 'Traditional Vegetables',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
      description: 'Known for traditional farming methods and organic vegetables. Rich cultural heritage combined with sustainable agricultural practices.',
      products: ['Radish', 'Spinach', 'Mustard Greens', 'Beans', 'Pumpkin'],
      climate: 'Temperate',
      altitude: '1300-1400m',
      bestSeason: 'October - March',
      farmingTech: 'Organic composting, Traditional terracing, Community farming'
    }
  ];

  const farmingTechnologies = [
    {
      icon: '💧',
      title: 'Drip Irrigation',
      description: 'Water-efficient system delivering water directly to plant roots, reducing waste by 50%'
    },
    {
      icon: '🌱',
      title: 'Organic Farming',
      description: 'Chemical-free cultivation using natural fertilizers and pest control methods'
    },
    {
      icon: '🏠',
      title: 'Greenhouse Technology',
      description: 'Controlled environment farming for year-round production and better quality'
    },
    {
      icon: '📱',
      title: 'Smart Farming',
      description: 'IoT sensors and mobile apps for monitoring soil, weather, and crop health'
    },
    {
      icon: '♻️',
      title: 'Crop Rotation',
      description: 'Sustainable practice maintaining soil fertility and reducing pest problems'
    },
    {
      icon: '🔬',
      title: 'Soil Testing',
      description: 'Scientific analysis ensuring optimal nutrient levels for healthy crops'
    }
  ];

  const sustainabilityRules = [
    {
      icon: '🚫',
      title: 'No Chemical Pesticides',
      description: 'We promote natural pest control methods to protect the environment and consumer health'
    },
    {
      icon: '💚',
      title: 'Organic Certification',
      description: 'All our partner farms follow strict organic farming standards and certifications'
    },
    {
      icon: '💧',
      title: 'Water Conservation',
      description: 'Efficient irrigation systems and rainwater harvesting to preserve water resources'
    },
    {
      icon: '🌍',
      title: 'Carbon Neutral',
      description: 'Supporting local farming reduces transportation emissions and carbon footprint'
    },
    {
      icon: '👨‍🌾',
      title: 'Fair Trade',
      description: 'Ensuring fair prices and working conditions for all farmers in our network'
    },
    {
      icon: '🌿',
      title: 'Biodiversity',
      description: 'Encouraging diverse crop cultivation to maintain ecological balance'
    }
  ];

  return (
    <div className="farming-regions-page">
      {/* Hero Section */}
      <motion.section 
        className="regions-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🇳🇵 Nepal's Agricultural Heritage
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover the diverse farming regions that bring fresh produce to your table
          </motion.p>
        </div>
      </motion.section>

      {/* Regions Section */}
      <section className="regions-showcase">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🗺️ Our Farming Regions</h2>
            <p>From the high Himalayas to the fertile Terai plains</p>
          </motion.div>

          <div className="regions-grid">
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                className={`region-card ${activeRegion === region.id ? 'active' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
              >
                <div className="region-image">
                  <img src={region.image} alt={region.name} />
                  <div className="region-overlay">
                    <span className="region-icon">{region.icon}</span>
                  </div>
                </div>

                <div className="region-content">
                  <h3>{region.name}</h3>
                  <p className="region-specialty">{region.specialty}</p>
                  <p className="region-description">{region.description}</p>

                  {activeRegion === region.id && (
                    <motion.div
                      className="region-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="detail-item">
                        <FiMapPin className="detail-icon" />
                        <div>
                          <strong>Altitude:</strong> {region.altitude}
                        </div>
                      </div>
                      <div className="detail-item">
                        <FiSun className="detail-icon" />
                        <div>
                          <strong>Climate:</strong> {region.climate}
                        </div>
                      </div>
                      <div className="detail-item">
                        <FiDroplet className="detail-icon" />
                        <div>
                          <strong>Best Season:</strong> {region.bestSeason}
                        </div>
                      </div>
                      <div className="products-list">
                        <strong>Main Products:</strong>
                        <div className="product-tags">
                          {region.products.map((product, idx) => (
                            <span key={idx} className="product-tag">{product}</span>
                          ))}
                        </div>
                      </div>
                      <div className="farming-tech-info">
                        <strong>Farming Technology:</strong>
                        <p>{region.farmingTech}</p>
                      </div>
                    </motion.div>
                  )}

                  <button className="view-more-btn">
                    {activeRegion === region.id ? 'Show Less' : 'Learn More'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farming Technologies */}
      <section className="farming-tech-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🚜 Modern Farming Technologies</h2>
            <p>Innovation meets tradition for sustainable agriculture</p>
          </motion.div>

          <div className="tech-grid">
            {farmingTechnologies.map((tech, index) => (
              <motion.div
                key={index}
                className="tech-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="tech-icon">{tech.icon}</div>
                <h3>{tech.title}</h3>
                <p>{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Rules */}
      <section className="sustainability-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🌱 Our Sustainability Commitment</h2>
            <p>Protecting the environment while feeding communities</p>
          </motion.div>

          <div className="rules-grid">
            {sustainabilityRules.map((rule, index) => (
              <motion.div
                key={index}
                className="rule-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="rule-icon">{rule.icon}</div>
                <div className="rule-content">
                  <h3>{rule.title}</h3>
                  <p>{rule.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2>🌾 Support Local Farmers</h2>
          <p>Every purchase helps sustain Nepal's agricultural heritage and supports farming families</p>
          <button className="cta-button">Start Shopping</button>
        </div>
      </motion.section>
    </div>
  );
};

export default FarmingRegionsPage;
