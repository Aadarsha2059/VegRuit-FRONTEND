import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiMapPin, FiAward, FiMessageCircle } from 'react-icons/fi';
import farmerOneImage from '../assets/farmer one.png';
import farmerTwoImage from '../assets/farmer two.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Farmers.css';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackFarmers = [
    {
      id: 1,
      name: 'Ram Bahadur Tamang',
      image: farmerOneImage,
      location: 'Lalitpur, Kathmandu Valley',
      specialty: 'Organic Vegetables',
      quote: 'Bringing the taste of tradition to your table, one vegetable at a time.',
    },
    {
      id: 2,
      name: 'Sita Devi Thapa',
      image: farmerTwoImage,
      location: 'Bhaktapur, Kathmandu Valley',
      specialty: 'Fresh Fruits',
      quote: 'Our passion is growing fruits that are as healthy as they are delicious.',
    },
  ];

  useEffect(() => {
    // Set farmers to fallback data and remove loading state
    setFarmers(fallbackFarmers);
    setLoading(false);
    
    // Removed API fetching to prevent loading other farmer names
  }, []);

  return (
    <section className="farmers" id="farmers">
      <div className="container">
        <div className="section-header">
          <h2>Our Farming Heroes</h2>
          <p>Meet the dedicated farmers who bring you the freshest produce.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading farmers...</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="farmers-swiper"
          >
          {farmers.map((farmer) => (
            <SwiperSlide key={farmer.id}>
              <div className="farmer-card">
                <div className="farmer-image">
                  <img src={farmer.image} alt={farmer.name} />
                </div>
                <div className="farmer-info">
                  <h3 className="farmer-name">{farmer.name}</h3>
                  <div className="farmer-details">
                    <span className="detail-item">
                      <FiMapPin /> {farmer.location}
                    </span>
                    <span className="detail-item">
                      <FiAward /> Specializes in {farmer.specialty}
                    </span>
                  </div>
                  <blockquote className="farmer-quote">
                    <FiMessageCircle className="quote-icon" />
                    {farmer.quote}
                  </blockquote>
                </div>
              </div>
            </SwiperSlide>
          ))}
          </Swiper>
        )}

        <div className="farmers-cta">
          <h3>Support Local Agriculture</h3>
          <p>Your purchase makes a difference. By choosing us, you are directly supporting local farmers and their families.</p>
          <button className="btn btn-secondary">Learn About Our Impact</button>
        </div>
      </div>
    </section>
  );
};

export default Farmers;