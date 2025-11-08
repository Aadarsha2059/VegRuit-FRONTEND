import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { feedbackAPI } from '../services/feedbackAPI';
import { STORAGE_KEYS } from '../services/authAPI';
import './FeedbackForm.css';

const FeedbackForm = ({ onClose, onSubmit, feedbackType = 'general_feedback', relatedData = {} }) => {
  const [formData, setFormData] = useState({
    feedbackType: feedbackType,
    subject: '',
    message: '',
    rating: 5,
    complaintCategory: '',
    relatedOrder: relatedData.orderId || null,
    relatedProduct: relatedData.productId || null,
    relatedSeller: relatedData.sellerId || null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await feedbackAPI.createFeedback(token, formData);

      if (response.success) {
        toast.success('Feedback submitted successfully!');
        if (onSubmit) {
          onSubmit(response.data.feedback);
        }
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Submit feedback error:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h3>
            {feedbackType === 'system_complaint' ? '📝 Submit Complaint' : 
             feedbackType === 'seller_feedback' ? '⭐ Seller Feedback' :
             '💬 Share Your Feedback'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>Feedback Type *</label>
            <select
              value={formData.feedbackType}
              onChange={(e) => handleChange('feedbackType', e.target.value)}
              required
            >
              <option value="general_feedback">General Feedback</option>
              <option value="product_feedback">Product Feedback</option>
              <option value="seller_feedback">Seller Feedback</option>
              <option value="system_complaint">System Complaint</option>
            </select>
          </div>

          {formData.feedbackType === 'system_complaint' && (
            <div className="form-group">
              <label>Complaint Category *</label>
              <select
                value={formData.complaintCategory}
                onChange={(e) => handleChange('complaintCategory', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="delivery">Delivery Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="product_quality">Product Quality</option>
                <option value="customer_service">Customer Service</option>
                <option value="technical_issue">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Rating *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleChange('rating', star)}
                >
                  ★
                </button>
              ))}
              <span className="rating-text">({formData.rating}/5)</span>
            </div>
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Brief summary of your feedback"
              maxLength={200}
              required
            />
            <small>{formData.subject.length}/200 characters</small>
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Share your detailed feedback, suggestions, or complaints..."
              rows={6}
              maxLength={2000}
              required
            />
            <small>{formData.message.length}/2000 characters</small>
          </div>

          <div className="feedback-info">
            <p>
              {formData.rating >= 4 
                ? '✨ Your positive feedback may be featured on our homepage!' 
                : '📝 Your feedback helps us improve our service.'}
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
