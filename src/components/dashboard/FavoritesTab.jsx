import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FavoritesTab.css'

const FavoritesTab = ({ favorites, onToggleFavorite, onAddToCart }) => {
  const navigate = useNavigate()

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-tab">
        <div className="favorites-header">
          <h2>❤️ My Favorites</h2>
          <p>Products you love, all in one place</p>
        </div>
        <div className="empty-favorites">
          <div className="empty-icon">💔</div>
          <h3>No Favorites Yet</h3>
          <p>Start adding products to your favorites to see them here!</p>
          <button className="btn btn-primary" onClick={() => navigate('/explore')}>
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-tab">
      <div className="favorites-header">
        <h2>❤️ My Favorites</h2>
        <p>You have {favorites.length} favorite {favorites.length === 1 ? 'product' : 'products'}</p>
      </div>

      <div className="favorites-grid">
        {favorites.map((favorite) => {
          const product = favorite.product
          return (
            <div key={favorite._id} className="favorite-card">
              <button 
                className="remove-favorite-btn"
                onClick={() => onToggleFavorite(product._id)}
                title="Remove from favorites"
              >
                ❤️
              </button>

              <div className="favorite-image" onClick={() => handleViewProduct(product._id)}>
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`http://localhost:5001${product.images[0]}`} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">🥬</div>
                )}
              </div>

              <div className="favorite-info">
                <h3>{product.name}</h3>
                <p className="favorite-description">{product.description}</p>
                
                <div className="favorite-meta">
                  <span className="favorite-price">Rs. {product.price}/{product.unit}</span>
                  {product.organic && <span className="organic-badge">🌱 Organic</span>}
                </div>

                <div className="favorite-stock">
                  {product.stock > 0 ? (
                    <span className="in-stock">✅ In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="out-of-stock">❌ Out of Stock</span>
                  )}
                </div>

                <div className="favorite-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => onAddToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    🛒 Add to Cart
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleViewProduct(product._id)}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FavoritesTab
