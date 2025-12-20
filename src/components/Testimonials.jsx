import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaStar, FaQuoteLeft, FaUser } from 'react-icons/fa';
import { reviewAPI } from '../services/reviewAPI';
import { feedbackAPI } from '../services/feedbackAPI';

import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/Testimonials.css';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback testimonial in case no real reviews are available
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      name: 'Priya Sharma',
      location: 'Kathmandu',
      rating: 5,
      comment: 'The quality of the produce is unmatched! Everything is so fresh and flavorful. It has completely changed the way my family eats.',
      isReal: false,
    },
    {
      id: 'fallback-2',
      name: 'Rajesh Kumar',
      location: 'Lalitpur',
      rating: 5,
      comment: 'Fast, reliable, and always fresh. I love the convenience and the fact that I am supporting local farmers. Highly recommended!',
      isReal: false,
    },
    {
      id: 'fallback-3',
      name: 'Sita Thapa',
      location: 'Bhaktapur',
      rating: 5,
      comment: 'An amazing selection of organic products. You can taste the difference in quality. My kids are eating more vegetables than ever!',
      isReal: false,
    },
  ];

  useEffect(() => {
    // Initial load
    loadReviews();
    
    // Poll for updates every 60 seconds
    const reviewsInterval = setInterval(loadReviews, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(reviewsInterval);
  }, []);

  const loadReviews = async () => {
    try {
      // Get feedbacks from homepage API
      const feedbackResponse = await feedbackAPI.getHomepageFeedbacks(10);
      
      if (feedbackResponse.success && feedbackResponse.data.feedbacks.length > 0) {
        const formattedFeedbacks = feedbackResponse.data.feedbacks.map(feedback => ({
          id: feedback._id,
          name: `${feedback.user?.firstName} ${feedback.user?.lastName}`,
          location: feedback.user?.city || 'Nepal',
          rating: feedback.rating || 5,
          comment: feedback.message,
          subject: feedback.subject,
          isReal: true,
          createdAt: feedback.createdAt
        }));
        setReviews(formattedFeedbacks);
      } else {
        // Fallback to product reviews if no feedbacks
        try {
          const response = await fetch('http://localhost:5001/api/reviews/recent-public');
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.reviews.length > 0) {
              const formattedReviews = data.data.reviews.map(review => ({
                id: review._id,
                name: `${review.buyer?.firstName} ${review.buyer?.lastName}`,
                location: review.buyer?.city || 'Nepal',
                rating: review.rating,
                comment: review.comment,
                productName: review.product?.name,
                isReal: true,
                createdAt: review.createdAt
              }));
              setReviews(formattedReviews);
            } else {
              setReviews(fallbackTestimonials);
            }
          } else {
            setReviews(fallbackTestimonials);
          }
        } catch (reviewError) {
          console.error('Error loading reviews:', reviewError);
          setReviews(fallbackTestimonials);
        }
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setReviews(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = reviews;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} color={index < rating ? '#ffc107' : '#e0e0e0'} />
    ));
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Real feedback from our valued customers about their experience with VegRuit & our Products.</p>
        </div>

        {loading ? (
          <div className="testimonials-loading">
            <p>Loading customer reviews...</p>
          </div>
        ) : (
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
              <div className={`testimonial-card ${testimonial.isReal ? 'real-review' : ''}`}>
                <div className="testimonial-content">
                  <FaQuoteLeft className="quote-icon" />
                  <p className="comment">{testimonial.comment}</p>
                </div>
                <div className="testimonial-author">
                  <div className="avatar-icon">
                    <FaUser />
                  </div>
                  <div className="author-info">
                    <h4 className="name">{testimonial.name}</h4>
                    <p className="location">{testimonial.location}</p>
                    {testimonial.subject && (
                      <p className="feedback-subject">{testimonial.subject}</p>
                    )}
                    {testimonial.productName && (
                      <p className="product-name">Reviewed: {testimonial.productName}</p>
                    )}
                    <div className="rating">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
                <AnimatedHighlightText />
              </div>
            </SwiperSlide>
          ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

// Animated highlight text component
const AnimatedHighlightText = () => {
  const words = [
    'Delicious', 'Nutritious', 'Refreshing', 'Organic', 
    'Energizing', 'Fresh', 'Healthy', 'Natural', 'Tasty', 'Satisfying'
  ];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="animated-highlight-container">
      <span className="static-text">Amazing = wonderfully </span>
      <span className="animated-word">{words[currentWordIndex]}</span>
    </div>
  );
};

export default Testimonials;