import React, { useState, useEffect } from 'react'
import '../styles/Testimonials.css'

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Anita Sharma',
      location: 'Thamel, Kathmandu',
      rating: 5,
      comment: 'VegRuit has transformed my cooking experience! The vegetables are always fresh and the fruits are incredibly sweet. I love supporting local farmers while getting premium quality produce.',
      avatar: '👩‍🦰',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Baneshwor, Kathmandu',
      rating: 5,
      comment: 'As a restaurant owner, I need the freshest ingredients daily. VegRuit never disappoints. Their delivery is prompt and the quality is consistently excellent.',
      avatar: '👨‍🍳',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Priya Tamang',
      location: 'Lalitpur, Kathmandu',
      rating: 5,
      comment: 'I appreciate how VegRuit connects us directly with local farmers. The produce tastes amazing and I feel good knowing I\'m supporting our community.',
      avatar: '👩‍🌾',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Bikash Thapa',
      location: 'Bhaktapur, Kathmandu',
      rating: 5,
      comment: 'The best online grocery service in Kathmandu! Fresh, affordable, and reliable. My family loves the variety of fruits and vegetables available.',
      avatar: '👨‍👩‍👧‍👦',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Sunita Gurung',
      location: 'Kirtipur, Kathmandu',
      rating: 5,
      comment: 'Amazing service! The fruits are so fresh and the delivery is super fast. I love the personal touch and attention to quality.',
      avatar: '👩‍💼',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const renderStars = (rating) => {
    return '⭐'.repeat(rating)
  }

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Real feedback from satisfied customers across Kathmandu</p>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonials-slider">
          <div className="slider-container">
            <div 
              className="slider-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-slide">
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="avatar">
                        <img src={testimonial.image} alt={testimonial.name} />
                      </div>
                      <div className="customer-info">
                        <h4>{testimonial.name}</h4>
                        <p className="location">{testimonial.location}</p>
                        <div className="rating">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <div className="testimonial-content">
                      <p>"{testimonial.comment}"</p>
                    </div>
                    <div className="testimonial-footer">
                      <span className="quote-icon">❝</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Navigation */}
          <div className="slider-navigation">
            <button className="nav-btn prev-btn" onClick={prevSlide}>
              <span>‹</span>
            </button>
            <button className="nav-btn next-btn" onClick={nextSlide}>
              <span>›</span>
            </button>
          </div>

          {/* Slider Dots */}
          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Average Rating</div>
            <div className="stat-stars">⭐⭐⭐⭐⭐</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
            <div className="stat-icon">😊</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
            <div className="stat-icon">🎯</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h3>Join Our Happy Customers</h3>
          <p>Experience the difference of fresh, local produce today!</p>
          <button className="btn btn-primary">Start Shopping Now</button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
