import React from 'react'
import '../styles/Products.css'

const Products = () => {
  const products = [
    {
      id: 1,
      name: 'Fresh Apples',
      price: 'Rs. 180/kg',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
      category: 'Fruits',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Organic Tomatoes',
      price: 'Rs. 90/kg',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=300&fit=crop',
      category: 'Vegetables',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'Sweet Mangoes',
      price: 'Rs. 200/kg',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop',
      category: 'Fruits',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: 'Fresh Cauliflower',
      price: 'Rs. 80/kg',
      image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=300&fit=crop',
      category: 'Vegetables',
      rating: 4.6,
      reviews: 67
    },
    {
      id: 5,
      name: 'Juicy Oranges',
      price: 'Rs. 120/kg',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
      category: 'Fruits',
      rating: 4.8,
      reviews: 98
    },
    {
      id: 6,
      name: 'Crisp Cucumbers',
      price: 'Rs. 60/kg',
      image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop',
      category: 'Vegetables',
      rating: 4.5,
      reviews: 73
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
    <section className="products" id="products">
      <div className="container">
        <div className="section-header">
          <h2>Our Fresh Products</h2>
          <p>Handpicked fresh fruits and vegetables from local farmers</p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>
              
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">({product.reviews} reviews)</span>
                </div>
                <div className="product-price">{product.price}</div>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

        <div className="products-cta">
          <h3>Want to See More?</h3>
          <p>Explore our complete catalog of fresh produce</p>
          <button className="btn btn-primary">View All Products</button>
        </div>
      </div>
    </section>
  )
}

export default Products
