import React from 'react'
import '../styles/Explore.css'

const Explore = () => {
  const categories = [
    {
      id: 1,
      name: 'Fresh Fruits',
      icon: '🍎',
      description: 'Sweet and nutritious fruits from local orchards',
      items: [
        { 
          name: 'Apples', 
          price: 'Rs. 180/kg', 
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop', 
          description: 'Sweet and crisp red apples' 
        },
        { 
          name: 'Oranges', 
          price: 'Rs. 120/kg', 
          image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop', 
          description: 'Juicy and vitamin C rich' 
        },
        { 
          name: 'Mangoes', 
          price: 'Rs. 200/kg', 
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop', 
          description: 'Sweet and aromatic mangoes' 
        },
        { 
          name: 'Bananas', 
          price: 'Rs. 80/kg', 
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop', 
          description: 'Fresh and energy-rich bananas' 
        }
      ]
    },
    {
      id: 2,
      name: 'Fresh Vegetables',
      icon: '🥬',
      description: 'Organic vegetables from local farmers',
      items: [
        { 
          name: 'Cauliflower', 
          price: 'Rs. 80/kg', 
          image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=200&h=200&fit=crop', 
          description: 'Fresh organic cauliflower' 
        },
        { 
          name: 'Tomatoes', 
          price: 'Rs. 90/kg', 
          image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=200&fit=crop', 
          description: 'Ripe and juicy tomatoes' 
        },
        { 
          name: 'Cucumber', 
          price: 'Rs. 60/kg', 
          image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=200&h=200&fit=crop', 
          description: 'Crisp and refreshing cucumbers' 
        },
        { 
          name: 'Carrots', 
          price: 'Rs. 70/kg', 
          image: 'https://images.unsplash.com/photo-1447175008436-170170e88636?w=200&h=200&fit=crop', 
          description: 'Sweet and crunchy carrots' 
        }
      ]
    },
    {
      id: 3,
      name: 'Seasonal Specials',
      icon: '🌟',
      description: 'Limited time seasonal produce',
      items: [
        { 
          name: 'Strawberries', 
          price: 'Rs. 300/kg', 
          image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop', 
          description: 'Sweet seasonal strawberries' 
        },
        { 
          name: 'Pomegranate', 
          price: 'Rs. 250/kg', 
          image: 'https://images.unsplash.com/photo-1541344999737-1c29d3fe0c8b?w=200&h=200&fit=crop', 
          description: 'Fresh pomegranate seeds' 
        },
        { 
          name: 'Green Peas', 
          price: 'Rs. 100/kg', 
          image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=200&h=200&fit=crop', 
          description: 'Fresh green peas' 
        },
        { 
          name: 'Spinach', 
          price: 'Rs. 50/kg', 
          image: 'https://images.unsplash.com/photo-1576045057992-9a503194f2ff?w=200&h=200&fit=crop', 
          description: 'Nutritious fresh spinach' 
        }
      ]
    }
  ]

  return (
    <section className="explore" id="explore">
      <div className="container">
        <div className="section-header">
          <h2>Explore Our Fresh Produce</h2>
          <p>Discover the finest selection of fruits and vegetables from local farmers in Kathmandu</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              
              <div className="items-grid">
                {category.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <span className="item-price">{item.price}</span>
                    </div>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="explore-features">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Same day delivery within Kathmandu Valley</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>100% Organic</h3>
            <p>All produce is certified organic and fresh</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🌾</div>
            <h3>Local Farmers</h3>
            <p>Direct from local farmers to your table</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Competitive prices for premium quality</p>
          </div>
        </div>

        <div className="cta-section">
          <h3>Ready to Start Shopping?</h3>
          <p>Join thousands of satisfied customers who trust VegRuit for their daily fresh produce needs</p>
          <button className="btn btn-primary">Start Shopping Now</button>
        </div>
      </div>
    </section>
  )
}

export default Explore
