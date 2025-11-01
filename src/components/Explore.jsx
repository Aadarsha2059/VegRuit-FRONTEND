import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiBox, FiFeather, FiGift } from 'react-icons/fi';
import '../styles/Explore.css';

const categories = [
  {
    id: 'vegetables',
    name: 'Fresh Vegetables',
    icon: <FiBox />,
    items: [
      { name: 'Spinach', image: 'https://images.unsplash.com/photo-1576045057992-9a503194f2ff?w=200&h=200&fit=crop' },
      { name: 'Broccoli', image: 'https://images.unsplash.com/photo-1587351177733-a03249697314?w=200&h=200&fit=crop' },
      { name: 'Carrot', image: 'https://images.unsplash.com/photo-1598170845058-32fe411b0521?w=200&h=200&fit=crop' },
      { name: 'Cucumber', image: 'https://images.unsplash.com/photo-1601253258214-35de732ea5b8?w=200&h=200&fit=crop' },
    ],
  },
  {
    id: 'fruits',
    name: 'Exotic Fruits',
    icon: <FiFeather />,
    items: [
      { name: 'Dragon Fruit', image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=200&h=200&fit=crop' },
      { name: 'Lychee', image: 'https://images.unsplash.com/photo-1531259459336-de386f3f72a4?w=200&h=200&fit=crop' },
      { name: 'Mango', image: 'https://images.unsplash.com/photo-1591078382203-765e44316d83?w=200&h=200&fit=crop' },
      { name: 'Pineapple', image: 'https://images.unsplash.com/photo-1587883139193-10b353a933d8?w=200&h=200&fit=crop' },
    ],
  },
  {
    id: 'seasonal',
    name: 'Seasonal Boxes',
    icon: <FiGift />,
    items: [
      { name: 'Summer Box', image: 'https://images.unsplash.com/photo-1590779431133-d9f4a49e33c2?w=200&h=200&fit=crop' },
      { name: 'Winter Box', image: 'https://images.unsplash.com/photo-1573500921999-89a65c1b4a94?w=200&h=200&fit=crop' },
      { name: 'Monsoon Box', image: 'https://images.unsplash.com/photo-1567791124560-c60b7d3834b1?w=200&h=200&fit=crop' },
      { name: 'Fiesta Box', image: 'https://images.unsplash.com/photo-1593280443077-ae4d6f5a7743?w=200&h=200&fit=crop' },
    ],
  },
];

const Explore = () => {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const activeCategory = categories.find(cat => cat.id === activeTab);

  return (
    <section className="explore" id="explore">
      <div className="container">
        <div className="section-header">
          <h2>Explore Our Collections</h2>
          <p>A curated selection of the finest produce, updated weekly.</p>
        </div>

        <div className="explore-content">
          <div className="tabs-container">
            {categories.map(category => (
              <button
                key={category.id}
                className={`tab-item ${activeTab === category.id ? 'active' : ''}`}
                onClick={() => setActiveTab(category.id)}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-name">{category.name}</span>
                <FiChevronRight className="tab-arrow" />
              </button>
            ))}
          </div>

          <div className="gallery-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="gallery-grid"
              >
                {activeCategory.items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="gallery-item"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="item-overlay">
                      <h3>{item.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="explore-cta">
          <h3>Ready to Taste the Freshness?</h3>
          <p>Browse our full catalog and get the best of nature delivered to your door.</p>
          <button className="btn btn-primary">Shop All Products</button>
        </div>
      </div>
    </section>
  );
};

export default Explore;
