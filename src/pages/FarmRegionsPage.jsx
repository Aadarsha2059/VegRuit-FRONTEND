import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiSun, FiDroplet, FiTrendingUp } from 'react-icons/fi';
import './FarmRegionsPage.css';

const FarmRegionsPage = () => {
  const [activeRegion, setActiveRegion] = useState(null);

  const regions = [
    {
      id: 1,
      name: 'Sindhuli District',
      icon: '🍊',
      specialty: 'Citrus Fruits',
      image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&h=600&fit=crop',
      description: 'Famous for its sweet and juicy oranges, mandarins, and lemons',
      products: ['Oranges', 'Mandarins', 'Lemons', 'Sweet Lime'],
      climate: 'Subtropical',
      altitude: '300-2000m',
      bestSeason: 'November - February',
      facts: [
        'Produces over 50,000 tons of citrus annually',
        'Ideal climate for citrus cultivation',
        'Rich in Vitamin C and antioxidants'
      ]
    },
    {
      id: 2,
      name: 'Jumla District',
      icon: '🍎',
      specialty: 'Premium Apples',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop',
      description: 'High-altitude apples known for their crisp texture and sweet taste',
      products: ['Red Delicious', 'Royal Gala', 'Fuji Apples', 'Golden Delicious'],
      climate: 'Temperate',
      altitude: '2000-3000m',
      bestSeason: 'September - November',
      facts: [
        'Highest quality apples in Nepal',
        'Organic farming practices',
        'Cold climate enhances sweetness'
      ]
    },
    {
      id: 3,
      name: 'Terai Region',
      icon: '🥬',
      specialty: 'Fresh Vegetables',
      image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&h=600&fit=crop',
      description: 'The breadbasket of Nepal, producing diverse vegetables year-round',
      products: ['Tomatoes', 'Cauliflower', 'Cabbage', 'Potatoes', 'Spinach', 'Eggplant'],
      climate: 'Tropical',
      altitude: '60-300m',
      bestSeason: 'Year-round',
      facts: [
        'Supplies 70% of Nepal\'s vegetables',
        'Fertile alluvial soil',
        'Multiple cropping seasons'
      ]
    },
    {
      id: 4,
      name: 'Bhaktapur District',
      icon: '🌾',
      specialty: 'Organic Vegetables',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
      description: 'Traditional farming methods producing premium organic vegetables',
      products: ['Organic Tomatoes', 'Leafy Greens', 'Radish', 'Carrots', 'Beans'],
      climate: 'Subtropical',
      altitude: '1200-1500m',
      bestSeason: 'October - March',
      facts: [
        'Heritage farming techniques',
        '100% organic certification',
        'Close to Kathmandu markets'
      ]
    }
  ];

  const farmingTechnologies = [
    {
      icon: '💧',
      title: 'Drip Irrigation',
      description: 'Water-efficient system delivering water directly to plant roots',
      benefits: ['Saves 50% water', 'Reduces weed growth', 'Increases yield by 30%']
    },
    {
      icon: '🌱',
      title: 'Organic Farming',
      description: 'Chemical-free cultivation using natural fertilizers and pest control',
      benefits: ['Healthier produce', 'Eco-friendly', 'Premium market value']
    },
    {
      icon: '🏠',
      title: 'Greenhouse Farming',
      description: 'Controlled environment agriculture for year-round production',
      benefits: ['Weather protection', 'Extended seasons', 'Higher quality']
    },
    {
      icon: '📱',
      title: 'Smart Farming',
      description: 'IoT sensors and mobile apps for precision agriculture',
      benefits: ['Real-time monitoring', 'Data-driven decisions', 'Optimized resources']
    }
  ];

  const farmingRules = [
    {
      icon: '✅',
      title: 'Quality Standards',
      rules: [
        'All produce must meet Nepal Food Safety Standards',
        'Regular quality inspections by certified agencies',
        'Proper grading and packaging requirements',
        'Traceability from farm to consumer'
      ]
    },
    {
      icon: '🌿',
      title: 'Organic Certification',
      rules: [
        'No synthetic pesticides or fertilizers',
        'Minimum 3-year transition period',
        'Annual inspection and certification',
        'Proper documentation and record keeping'
      ]
    },
    {
      icon: '🚜',
      title: 'Sustainable Practices',
      rules: [
        'Crop rotation to maintain soil health',
        'Water conservation techniques mandatory',
        'Integrated pest management (IPM)',
        'Composting and organic waste management'
      ]
    },
    {
      icon: '🤝',
      title: 'Fair Trade',
      rules: [
        'Fair pricing for farmers',
        'Direct market access through VegRuit',
        'Transparent transactions',
        'Support for small-scale farmers'
      ]
    }
  ];

  return (
    <div className="farm-regions-page">
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
            🇳🇵 Nepal's Agricultural Treasures
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover the rich farming regions and innovative agricultural practices of Nepal
          </motion.p>
        </div>
      </motion.section>

      {/* Farm Regions Section */}
      <section className="regions-showcase">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🗺️ Famous Farming Regions</h2>
            <p>Explore Nepal's diverse agricultural landscapes and their specialty products</p>
          </motion.div>

          <div className="regions-grid">
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                className={`region-card ${activeRegion === region.id ? 'active' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
              >
                <div className="region-image">
                  <img src={region.image} alt={region.name} />
                  <div className="region-icon">{region.icon}</div>
                </div>
                
                <div className="region-info">
                  <h3>{region.name}</h3>
                  <p className="specialty">{region.specialty}</p>
                  <p className="description">{region.description}</p>
                  
                  <div className="region-meta">
                    <div className="meta-item">
                      <FiMapPin /> {region.altitude}
                    </div>
                    <div className="meta-item">
                      <FiSun /> {region.climate}
                    </div>
                  </div>

                  {activeRegion === region.id && (
                    <motion.div 
                      className="region-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="products-list">
                        <h4>Main Products:</h4>
                        <div className="product-tags">
                          {region.products.map((product, i) => (
                            <span key={i} className="product-tag">{product}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="best-season">
                        <FiDroplet />
                        <span>Best Season: {region.bestSeason}</span>
                      </div>

                      <div className="facts-list">
                        <h4>Interesting Facts:</h4>
                        <ul>
                          {region.facts.map((fact, i) => (
                            <li key={i}>✓ {fact}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                  
                  <button className="learn-more-btn">
                    {activeRegion === region.id ? 'Show Less' : 'Learn More'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farming Technologies Section */}
      <section className="farming-tech-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🚜 Modern Farming Technologies</h2>
            <p>Innovative techniques empowering Nepal's farmers</p>
          </motion.div>

          <div className="tech-grid">
            {farmingTechnologies.map((tech, index) => (
              <motion.div
                key={index}
                className="tech-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="tech-icon">{tech.icon}</div>
                <h3>{tech.title}</h3>
                <p>{tech.description}</p>
                <div className="benefits-list">
                  {tech.benefits.map((benefit, i) => (
                    <div key={i} className="benefit-item">
                      <FiTrendingUp /> {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farming Rules Section */}
      <section className="farming-rules-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>📋 Farming Standards & Guidelines</h2>
            <p>Ensuring quality, sustainability, and fair practices</p>
          </motion.div>

          <div className="rules-grid">
            {farmingRules.map((category, index) => (
              <motion.div
                key={index}
                className="rules-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="rules-header">
                  <span className="rules-icon">{category.icon}</span>
                  <h3>{category.title}</h3>
                </div>
                <ul className="rules-list">
                  {category.rules.map((rule, i) => (
                    <li key={i}>
                      <span className="rule-bullet">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🌾 Support Local Farmers</h2>
            <p>Buy fresh, quality produce directly from Nepal's farming regions</p>
            <button className="cta-button">Start Shopping</button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FarmRegionsPage;
