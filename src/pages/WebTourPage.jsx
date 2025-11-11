import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import '../styles/WebTourPage.css';

const WebTourPage = () => {
  const [activeTab, setActiveTab] = useState('buyer');
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const buyerSteps = {
    english: [
      {
        step: 1,
        title: "Create Your Buyer Account",
        description: "Click on 'Login / Sign Up' button in the header, then select 'Buyer Sign Up'. Fill in your details including name, email, phone, address, and create a secure password.",
        icon: "👤",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
      },
      {
        step: 2,
        title: "Browse Fresh Products",
        description: "Explore our wide range of fresh vegetables and fruits. Use filters to find exactly what you need. Check product details, prices, and seller information.",
        icon: "🛒",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
      },
      {
        step: 3,
        title: "Add to Cart",
        description: "Select the quantity you want and click 'Add to Cart'. You can continue shopping or proceed to checkout. Review your cart anytime by clicking the cart icon.",
        icon: "🛍️",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop"
      },
      {
        step: 4,
        title: "Checkout & Payment",
        description: "Review your order, confirm delivery address, and choose your payment method. We support multiple payment options including cash on delivery.",
        icon: "💳",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
      },
      {
        step: 5,
        title: "Track Your Order",
        description: "After placing your order, track its status in your dashboard. Get notifications about order confirmation, shipping, and delivery.",
        icon: "📦",
        image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop"
      },
      {
        step: 6,
        title: "Receive Fresh Produce",
        description: "Get your fresh vegetables and fruits delivered to your doorstep. Check the quality and enjoy farm-fresh goodness!",
        icon: "✅",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop"
      }
    ],
    nepali: [
      {
        step: 1,
        title: "आफ्नो खरिददार खाता बनाउनुहोस्",
        description: "हेडरमा 'Login / Sign Up' बटनमा क्लिक गर्नुहोस्, त्यसपछि 'Buyer Sign Up' चयन गर्नुहोस्। आफ्नो नाम, इमेल, फोन, ठेगाना भर्नुहोस् र सुरक्षित पासवर्ड बनाउनुहोस्।",
        icon: "👤",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
      },
      {
        step: 2,
        title: "ताजा उत्पादनहरू ब्राउज गर्नुहोस्",
        description: "हाम्रो ताजा तरकारी र फलफूलको विस्तृत श्रृंखला अन्वेषण गर्नुहोस्। तपाईंलाई चाहिने कुरा फेला पार्न फिल्टर प्रयोग गर्नुहोस्। उत्पादन विवरण, मूल्य र बिक्रेता जानकारी जाँच गर्नुहोस्।",
        icon: "🛒",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
      },
      {
        step: 3,
        title: "कार्टमा थप्नुहोस्",
        description: "तपाईंले चाहेको मात्रा चयन गर्नुहोस् र 'Add to Cart' मा क्लिक गर्नुहोस्। तपाईं किनमेल जारी राख्न वा चेकआउटमा जान सक्नुहुन्छ। कार्ट आइकनमा क्लिक गरेर जुनसुकै बेला आफ्नो कार्ट समीक्षा गर्नुहोस्।",
        icon: "🛍️",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop"
      },
      {
        step: 4,
        title: "चेकआउट र भुक्तानी",
        description: "आफ्नो अर्डर समीक्षा गर्नुहोस्, डेलिभरी ठेगाना पुष्टि गर्नुहोस्, र आफ्नो भुक्तानी विधि छान्नुहोस्। हामी नगद डेलिभरी सहित धेरै भुक्तानी विकल्पहरू समर्थन गर्छौं।",
        icon: "💳",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
      },
      {
        step: 5,
        title: "आफ्नो अर्डर ट्र्याक गर्नुहोस्",
        description: "अर्डर राखेपछि, आफ्नो ड्यासबोर्डमा यसको स्थिति ट्र्याक गर्नुहोस्। अर्डर पुष्टिकरण, ढुवानी र डेलिभरीको बारेमा सूचनाहरू प्राप्त गर्नुहोस्।",
        icon: "📦",
        image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop"
      },
      {
        step: 6,
        title: "ताजा उत्पादन प्राप्त गर्नुहोस्",
        description: "आफ्नो ताजा तरकारी र फलफूल आफ्नो ढोकामा डेलिभर गराउनुहोस्। गुणस्तर जाँच गर्नुहोस् र खेतबाट ताजा उत्पादनको आनन्द लिनुहोस्!",
        icon: "✅",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop"
      }
    ]
  };

  const sellerSteps = {
    english: [
      {
        step: 1,
        title: "Register as a Seller",
        description: "Click 'Login / Sign Up' and select 'Seller Sign Up'. Provide your farm details, contact information, and create your seller account. This helps buyers know about your farm.",
        icon: "🌾",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"
      },
      {
        step: 2,
        title: "Set Up Your Profile",
        description: "Complete your seller profile with farm name, location, and description. Add photos of your farm to build trust with customers. A complete profile attracts more buyers.",
        icon: "📝",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop"
      },
      {
        step: 3,
        title: "Add Your Products",
        description: "List your fresh produce with clear photos, accurate descriptions, and competitive prices. Specify quantity available, unit of measurement, and any special features (organic, etc.).",
        icon: "📸",
        image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&h=400&fit=crop"
      },
      {
        step: 4,
        title: "Manage Inventory",
        description: "Keep your product listings updated with current stock levels. Mark items as out of stock when needed. Update prices based on season and availability.",
        icon: "📊",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
      },
      {
        step: 5,
        title: "Receive & Process Orders",
        description: "Get notified when customers place orders. Review order details, confirm availability, and prepare products for delivery. Communicate with buyers if needed.",
        icon: "📬",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
      },
      {
        step: 6,
        title: "Deliver & Get Paid",
        description: "Arrange delivery or coordinate with our delivery partners. Once delivered, receive payment through your preferred method. Track your earnings in the seller dashboard.",
        icon: "💰",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop"
      }
    ],
    nepali: [
      {
        step: 1,
        title: "बिक्रेताको रूपमा दर्ता गर्नुहोस्",
        description: "'Login / Sign Up' मा क्लिक गर्नुहोस् र 'Seller Sign Up' चयन गर्नुहोस्। आफ्नो खेत विवरण, सम्पर्क जानकारी प्रदान गर्नुहोस् र आफ्नो बिक्रेता खाता बनाउनुहोस्। यसले खरिददारहरूलाई तपाईंको खेतको बारेमा जान्न मद्दत गर्छ।",
        icon: "🌾",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"
      },
      {
        step: 2,
        title: "आफ्नो प्रोफाइल सेटअप गर्नुहोस्",
        description: "खेतको नाम, स्थान र विवरणको साथ आफ्नो बिक्रेता प्रोफाइल पूरा गर्नुहोस्। ग्राहकहरूसँग विश्वास निर्माण गर्न आफ्नो खेतका फोटोहरू थप्नुहोस्। पूर्ण प्रोफाइलले धेरै खरिददारहरूलाई आकर्षित गर्छ।",
        icon: "📝",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop"
      },
      {
        step: 3,
        title: "आफ्नो उत्पादनहरू थप्नुहोस्",
        description: "स्पष्ट फोटो, सही विवरण र प्रतिस्पर्धी मूल्यहरूको साथ आफ्नो ताजा उत्पादन सूचीबद्ध गर्नुहोस्। उपलब्ध मात्रा, मापन एकाइ र कुनै विशेष सुविधाहरू (जैविक, आदि) निर्दिष्ट गर्नुहोस्।",
        icon: "📸",
        image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&h=400&fit=crop"
      },
      {
        step: 4,
        title: "सूची व्यवस्थापन गर्नुहोस्",
        description: "हालको स्टक स्तरहरूसँग आफ्नो उत्पादन सूचीहरू अद्यावधिक राख्नुहोस्। आवश्यक पर्दा वस्तुहरूलाई स्टक बाहिर चिन्ह लगाउनुहोस्। मौसम र उपलब्धताको आधारमा मूल्यहरू अद्यावधिक गर्नुहोस्।",
        icon: "📊",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
      },
      {
        step: 5,
        title: "अर्डरहरू प्राप्त र प्रशोधन गर्नुहोस्",
        description: "ग्राहकहरूले अर्डर राख्दा सूचना प्राप्त गर्नुहोस्। अर्डर विवरण समीक्षा गर्नुहोस्, उपलब्धता पुष्टि गर्नुहोस्, र डेलिभरीको लागि उत्पादनहरू तयार गर्नुहोस्। आवश्यक भएमा खरिददारहरूसँग कुराकानी गर्नुहोस्।",
        icon: "📬",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
      },
      {
        step: 6,
        title: "डेलिभर गर्नुहोस् र भुक्तानी प्राप्त गर्नुहोस्",
        description: "डेलिभरीको व्यवस्था गर्नुहोस् वा हाम्रो डेलिभरी साझेदारहरूसँग समन्वय गर्नुहोस्। डेलिभर भएपछि, आफ्नो मनपर्ने विधि मार्फत भुक्तानी प्राप्त गर्नुहोस्। बिक्रेता ड्यासबोर्डमा आफ्नो आम्दानी ट्र्याक गर्नुहोस्।",
        icon: "💰",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop"
      }
    ]
  };

  const currentSteps = activeTab === 'buyer' ? buyerSteps[language] : sellerSteps[language];

  return (
    <motion.div 
      className="web-tour-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <motion.section className="tour-hero" variants={fadeInUp}>
        <div className="hero-overlay">
          <div className="hero-content">
            <BackButton />
            <motion.h1 className="hero-title" variants={fadeInUp}>
              {language === 'english' ? 'Web Tour' : 'वेब टुर'}
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              {language === 'english' 
                ? 'Learn how to use VegRuit platform step by step'
                : 'VegRuit प्लेटफर्म कसरी प्रयोग गर्ने चरण-दर-चरण सिक्नुहोस्'}
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Language Toggle */}
      <section className="language-toggle-section">
        <div className="container">
          <div className="language-toggle">
            <button 
              className={`lang-btn ${language === 'english' ? 'active' : ''}`}
              onClick={() => setLanguage('english')}
            >
              🇬🇧 English
            </button>
            <button 
              className={`lang-btn ${language === 'nepali' ? 'active' : ''}`}
              onClick={() => setLanguage('nepali')}
            >
              🇳🇵 नेपाली
            </button>
          </div>
        </div>
      </section>

      {/* Tab Selection */}
      <section className="tab-selection-section">
        <div className="container">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'buyer' ? 'active' : ''}`}
              onClick={() => setActiveTab('buyer')}
            >
              <span className="tab-icon">🛒</span>
              <span className="tab-text">
                {language === 'english' ? 'For Buyers' : 'खरिददारहरूको लागि'}
              </span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'seller' ? 'active' : ''}`}
              onClick={() => setActiveTab('seller')}
            >
              <span className="tab-icon">🌾</span>
              <span className="tab-text">
                {language === 'english' ? 'For Sellers' : 'बिक्रेताहरूको लागि'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {activeTab === 'buyer' 
                ? (language === 'english' ? 'How to Buy' : 'कसरी किन्ने')
                : (language === 'english' ? 'How to Sell' : 'कसरी बेच्ने')}
            </h2>
            <p className="section-subtitle">
              {language === 'english' 
                ? 'Follow these simple steps to get started'
                : 'सुरु गर्न यी सरल चरणहरू पालना गर्नुहोस्'}
            </p>
          </div>

          <div className="steps-grid">
            {currentSteps.map((step, index) => (
              <motion.div 
                key={index}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-image">
                  <img src={step.image} alt={step.title} />
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </motion.div>
            ))}
            <div className="journey-finish">
              <div className="finish-marker">
                🎯
              </div>
              <p className="finish-text">
                {language === 'english' ? 'Journey Complete!' : 'यात्रा पूर्ण!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="tour-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>
              {language === 'english' 
                ? 'Ready to Get Started?' 
                : 'सुरु गर्न तयार हुनुहुन्छ?'}
            </h2>
            <p>
              {language === 'english'
                ? 'Join VegRuit today and experience the best way to buy or sell fresh produce in Nepal.'
                : 'आज VegRuit मा सामेल हुनुहोस् र नेपालमा ताजा उत्पादन किन्न वा बेच्ने उत्तम तरिका अनुभव गर्नुहोस्।'}
            </p>
            <div className="cta-buttons">
              {activeTab === 'buyer' ? (
                <>
                  <Link to="/buyer-signup" className="cta-button primary">
                    {language === 'english' ? '🛒 Sign Up as Buyer' : '🛒 खरिददारको रूपमा साइन अप गर्नुहोस्'}
                  </Link>
                  <Link to="/buyer-login" className="cta-button secondary">
                    {language === 'english' ? 'Already have an account?' : 'पहिले नै खाता छ?'}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/seller-signup" className="cta-button primary">
                    {language === 'english' ? '🌾 Sign Up as Seller' : '🌾 बिक्रेताको रूपमा साइन अप गर्नुहोस्'}
                  </Link>
                  <Link to="/seller-login" className="cta-button secondary">
                    {language === 'english' ? 'Already have an account?' : 'पहिले नै खाता छ?'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default WebTourPage;
