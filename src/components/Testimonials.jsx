import React from 'react'
import '../styles/Testimonials.css'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Kathmandu, Nepal',
      rating: 5,
      comment: 'VegRuit has completely transformed my shopping experience! The fresh produce is always top-quality and the delivery is incredibly fast. I love supporting local farmers while getting the best fruits and vegetables.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Lalitpur, Nepal',
      rating: 5,
      comment: 'As a health-conscious person, I appreciate the organic quality of VegRuit products. The customer service is excellent and the prices are very reasonable. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-12'
    },
    {
      id: 3,
      name: 'Sita Thapa',
      location: 'Bhaktapur, Nepal',
      rating: 5,
      comment: 'The convenience of ordering fresh produce online and having it delivered to my doorstep is amazing. VegRuit makes healthy eating so much easier for busy families like mine.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-10'
    },
    {
      id: 4,
      name: 'Bikash Tamang',
      location: 'Kathmandu, Nepal',
      rating: 5,
      comment: 'I\'ve been a loyal customer for months now. The quality is consistently excellent and I love knowing that I\'m supporting local farmers. VegRuit is my go-to for all fresh produce needs.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-08'
    },
    {
      id: 5,
      name: 'Anita Gurung',
      location: 'Kirtipur, Nepal',
      rating: 5,
      comment: 'The seasonal specials are fantastic! I love trying new fruits and vegetables that I wouldn\'t normally find. VegRuit has expanded my culinary horizons.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-05'
    },
    {
      id: 6,
      name: 'Mohan Singh',
      location: 'Kathmandu, Nepal',
      rating: 5,
      comment: 'Fast delivery, fresh produce, and excellent customer service. What more could you ask for? VegRuit has made grocery shopping enjoyable again.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-03'
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="star">
        {index < rating ? '★' : '☆'}
      </span>
    ))
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Real feedback from satisfied customers across Kathmandu Valley</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="avatar"
                />
                <div className="customer-info">
                  <h4>{testimonial.name}</h4>
                  <p className="location">{testimonial.location}</p>
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              <div className="testimonial-content">
                <p>"{testimonial.comment}"</p>
              </div>
              
              <div className="testimonial-footer">
                <span className="quote-icon">💬</span>
                <span className="testimonial-date">
                  {new Date(testimonial.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
