import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { reviewAPI } from '../services/reviewAPI';
import { authAPI } from '../services/authAPI';
import './ReviewForm.css';

const StarRating = ({ rating, onRatingChange, label, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating-container">
      {label && <label className="rating-label">{label}</label>}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
            onClick={() => !disabled && onRatingChange(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            disabled={disabled}
          >
            ★
          </button>
        ))}
        <span className="rating-text">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'No rating'}
        </span>
      </div>
    </div>
  );
};

const ReviewForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    qualityRating: 0,
    deliveryRating: 0,
    valueRating: 0,
    isRecommended: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';
    if (!formData.title.trim()) newErrors.title = 'Please enter a title';
    if (!formData.comment.trim()) newErrors.comment = 'Please write a review';
    if (formData.comment.trim().length < 10) newErrors.comment = 'Review must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = authAPI.getAuthToken();
      const reviewData = {
        productId: product.productId,
        orderId: product.orderId,
        ...formData
      };

      const response = await reviewAPI.createReview(token, reviewData);
      
      if (response.success) {
        toast.success('Review submitted successfully!');
        onSubmit(response.data.review);
        onClose();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Submit review error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h3>Write a Review</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="product-info">
          <div className="product-image">
            <img 
              src={product.productImage ? `http://localhost:5001${product.productImage}` : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop'} 
              alt={product.productName}
            />
          </div>
          <div className="product-details">
            <h4>{product.productName}</h4>
            <p>Order #{product.orderNumber}</p>
            <p>Quantity: {product.quantity} {product.unit || 'pcs'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Overall Rating */}
          <div className="form-group">
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
              label="Overall Rating *"
            />
            {errors.rating && <span className="error-text">{errors.rating}</span>}
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Review Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Summarize your experience"
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Comment */}
          <div className="form-group">
            <label>Your Review *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Tell others about your experience with this product..."
              className={errors.comment ? 'error' : ''}
              rows={4}
              maxLength={1000}
            />
            <div className="char-count">{formData.comment.length}/1000</div>
            {errors.comment && <span className="error-text">{errors.comment}</span>}
          </div>

          {/* Detailed Ratings */}
          <div className="detailed-ratings">
            <h4>Rate Different Aspects</h4>
            
            <StarRating
              rating={formData.qualityRating}
              onRatingChange={(rating) => handleInputChange('qualityRating', rating)}
              label="Quality"
            />
            
            <StarRating
              rating={formData.deliveryRating}
              onRatingChange={(rating) => handleInputChange('deliveryRating', rating)}
              label="Delivery"
            />
            
            <StarRating
              rating={formData.valueRating}
              onRatingChange={(rating) => handleInputChange('valueRating', rating)}
              label="Value for Money"
            />
          </div>

          {/* Recommendation */}
          <div className="form-group">
            <label>Would you recommend this product?</label>
            <div className="recommendation-buttons">
              <button
                type="button"
                className={`recommend-btn ${formData.isRecommended === true ? 'active yes' : ''}`}
                onClick={() => handleInputChange('isRecommended', true)}
              >
                👍 Yes
              </button>
              <button
                type="button"
                className={`recommend-btn ${formData.isRecommended === false ? 'active no' : ''}`}
                onClick={() => handleInputChange('isRecommended', false)}
              >
                👎 No
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;