import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { productAPI } from '../services/productAPI';
import { cartAPI } from '../services/cartAPI';
import { favoritesAPI } from '../services/favoritesAPI';
import { reviewAPI } from '../services/reviewAPI';
import { STORAGE_KEYS } from '../services/authAPI';
import BackgroundAnimation from '../components/BackgroundAnimation';
import './ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const BACKEND_BASE = 'http://localhost:5001';

  useEffect(() => {
    loadProduct();
    if (token) {
      checkFavoriteStatus();
      loadReviews();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getProduct(productId);
      if (response.success) {
        setProduct(response.data.product);
      } else {
        toast.error('Product not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesAPI.checkFavorite(token, productId);
      if (response.success) {
        setIsFavorite(response.data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getProductReviews(productId);
      if (response.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/buyer-login');
      return;
    }

    try {
      const response = await cartAPI.addToCart(token, productId, quantity);
      if (response.success) {
        toast.success('Added to cart!');
      } else {
        toast.error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      toast.error('Please login to add favorites');
      navigate('/buyer-login');
      return;
    }

    try {
      if (isFavorite) {
        const response = await favoritesAPI.removeFromFavorites(token, productId);
        if (response.success) {
          setIsFavorite(false);
          toast.success('Removed from favorites');
        }
      } else {
        const response = await favoritesAPI.addToFavorites(token, productId);
        if (response.success) {
          setIsFavorite(true);
          toast.success('Added to favorites!');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <>
        <BackgroundAnimation />
        <div className="product-detail-loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => `${BACKEND_BASE}${img}`)
    : ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop'];

  return (
    <>
      <BackgroundAnimation />
      <div className="product-detail-page">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="product-detail-content">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <img src={images[selectedImage]} alt={product.name} />
                <button 
                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              </div>
              {images.length > 1 && (
                <div className="image-thumbnails">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={selectedImage === index ? 'active' : ''}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info-section">
              <div className="product-category-badge">
                {product.category?.name || 'Uncategorized'}
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating">
                {renderStars(product.averageRating || 0)}
                <span className="rating-text">
                  {product.averageRating?.toFixed(1) || '0.0'} ({product.totalReviews || 0} reviews)
                </span>
              </div>

              <div className="product-price-section">
                <span className="product-price">Rs. {product.price}</span>
                <span className="product-unit">/ {product.unit}</span>
              </div>

              {product.organic && (
                <div className="organic-badge-large">
                  🌱 Certified Organic
                </div>
              )}

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description || 'No description available.'}</p>
              </div>

              <div className="product-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Stock:</span>
                  <span className="detail-value">
                    {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of stock'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Origin:</span>
                  <span className="detail-value">{product.origin || 'Local'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Seller:</span>
                  <span className="detail-value">
                    {product.seller?.farmName || product.seller?.firstName || 'TarkariShop'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Freshness:</span>
                  <span className="detail-value">{product.fresh ? '✓ Fresh' : 'Packaged'}</span>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="product-actions">
                  <div className="quantity-selector">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                    />
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                    🛒 Add to Cart
                  </button>
                </div>
              )}

              {product.stock === 0 && (
                <div className="out-of-stock-notice">
                  ⚠️ This product is currently out of stock
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>{review.buyer?.firstName || 'Anonymous'}</strong>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
