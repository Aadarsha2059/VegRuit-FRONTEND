import React from 'react'
import appleImage from '../assets/apple.png'
import orangeImage from '../assets/orange.png'
import mangoImage from '../assets/mango.png'
import cauliflowerImage from '../assets/cauliflower.png'
import cucumberImage from '../assets/cucumber.png'
import tomatoImage from '../assets/tomato.png'
import '../styles/Products.css'

const Products = () => {
  const fruits = [
    {
      id: 1,
      name: 'Fresh Apples',
      image: appleImage,
      price: 'Rs. 180/kg',
      description: 'Sweet and crisp apples from local orchards',
      category: 'Fruits'
    },
    {
      id: 2,
      name: 'Juicy Oranges',
      image: orangeImage,
      price: 'Rs. 120/kg',
      description: 'Vitamin C rich oranges, perfect for health',
      category: 'Fruits'
    },
    {
      id: 3,
      name: 'Ripe Mangoes',
      image: mangoImage,
      price: 'Rs. 150/kg',
      description: 'Sweet and aromatic mangoes in season',
      category: 'Fruits'
    }
  ]

  const vegetables = [
    {
      id: 4,
      name: 'Fresh Cauliflower',
      image: cauliflowerImage,
      price: 'Rs. 80/kg',
      description: 'White and clean cauliflower heads',
      category: 'Vegetables'
    },
    {
      id: 5,
      name: 'Crisp Cucumbers',
      image: cucumberImage,
      price: 'Rs. 60/kg',
      description: 'Cool and refreshing cucumbers',
      category: 'Vegetables'
    },
    {
      id: 6,
      name: 'Red Tomatoes',
      image: tomatoImage,
      price: 'Rs. 90/kg',
      description: 'Ripe and juicy tomatoes',
      category: 'Vegetables'
    }
  ]

  return (
    <section className="products" id="explore">
      <div className="container">
        <div className="section-header">
          <h2>Our Fresh Products</h2>
          <p>Discover the finest selection of locally grown produce</p>
        </div>

        <div className="products-category">
          <h3>Fresh Fruits</h3>
          <div className="products-grid">
            {fruits.map((fruit) => (
              <div key={fruit.id} className="product-card">
                <div className="product-image">
                  <img src={fruit.image} alt={fruit.name} />
                  <div className="product-badge">{fruit.category}</div>
                </div>
                <div className="product-info">
                  <h4>{fruit.name}</h4>
                  <p>{fruit.description}</p>
                  <div className="product-price">{fruit.price}</div>
                  <button className="btn btn-outline">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="products-category">
          <h3>Fresh Vegetables</h3>
          <div className="products-grid">
            {vegetables.map((vegetable) => (
              <div key={vegetable.id} className="product-card">
                <div className="product-image">
                  <img src={vegetable.image} alt={vegetable.name} />
                  <div className="product-badge">{vegetable.category}</div>
                </div>
                <div className="product-info">
                  <h4>{vegetable.name}</h4>
                  <p>{vegetable.description}</p>
                  <div className="product-price">{vegetable.price}</div>
                  <button className="btn btn-outline">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products
