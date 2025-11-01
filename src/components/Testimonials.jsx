import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Kathmandu',
      rating: 5,
      comment: 'The quality of the produce is unmatched! Everything is so fresh and flavorful. It has completely changed the way my family eats.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Lalitpur',
      rating: 5,
      comment: 'Fast, reliable, and always fresh. I love the convenience and the fact that I am supporting local farmers. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'Sita Thapa',
      location: 'Bhaktapur',
      rating: 5,
      comment: 'An amazing selection of organic products. You can taste the difference in quality. My kids are eating more vegetables than ever!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 4,
      name: 'Bikash Tamang',
      location: 'Kathmandu',
      rating: 5,
      comment: 'I am so impressed with the customer service. They are always helpful and friendly. A great company with a great mission.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} color={index < rating ? '#ffc107' : '#e0e0e0'} />
    ));
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>Voices of Our Happy Customers</h2>
          <p>Discover why families across the valley trust us for their daily dose of freshness.</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <FaQuoteLeft className="quote-icon" />
                  <p className="comment">{testimonial.comment}</p>
                </div>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                  <div className="author-info">
                    <h4 className="name">{testimonial.name}</h4>
                    <p className="location">{testimonial.location}</p>
                    <div className="rating">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
