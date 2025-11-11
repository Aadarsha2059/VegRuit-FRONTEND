import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Hero from './components/Hero'
import EnhancedHero from './components/EnhancedHero'
import Products from './components/Products'
import Farmers from './components/Farmers'
import Testimonials from './components/Testimonials'
import Explore from './components/Explore'
import About from './components/About'
import Footer from './components/Footer'
import MainAuth from './components/auth/MainAuth'
import ProtectedRoute from './components/ProtectedRoute'
import AuthTest from './components/AuthTest'
import EnhancedBuyerDashboard from './pages/EnhancedBuyerDashboard'
import EnhancedSellerDashboard from './pages/EnhancedSellerDashboard'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ExplorePage from './pages/ExplorePage'
import WebTourPage from './pages/WebTourPage'
import AuthPage from './pages/Auth'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderDetail from './pages/OrderDetail'
import ProductDetail from './pages/ProductDetail'
// Add imports for new components
import BuyerLogin from './pages/BuyerLogin'
import SellerLogin from './pages/SellerLogin'
import BuyerSignup from './pages/BuyerSignup'
import SellerSignup from './pages/SellerSignup'
import ResetPassword from './pages/ResetPassword'
import BackgroundAnimation from './components/BackgroundAnimation'
import NepaliWelcomeDialog from './components/NepaliWelcomeDialog'
import { STORAGE_KEYS, USER_TYPES } from './services/authAPI'
import './App.css'

// Component to conditionally render header and footer
const ConditionalLayout = ({ user, onLogout, onAuthClick, children }) => {
  const location = useLocation()
  const isDashboard = location.pathname.includes('dashboard')
  const isAuthPage = location.pathname === '/auth'
  
  return (
    <>
      {!isDashboard && !isAuthPage && (
        <Header 
          user={user} 
          onLogout={onLogout} 
          onAuthClick={onAuthClick}
        />
      )}
      {children}
      {!isDashboard && !isAuthPage && <Footer />}
    </>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Check for existing user data and token
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE)
    
    if (userData && token) {
      const parsedUser = JSON.parse(userData)
      // Ensure userType is set correctly
      const userWithType = {
        ...parsedUser,
        userType: parsedUser.userType || userType
      }
      setUser(userWithType)
    }
  }, [])

  const handleAuthSuccess = (userData) => {
    // Ensure userType is set correctly
    const userWithType = {
      ...userData,
      userType: userData.userType || JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_TYPE) || '["buyer"]')
    }
    setUser(userWithType)
    setShowAuth(false)
    
    // Navigate to appropriate dashboard based on user roles
    if (userWithType.isBuyer && userWithType.isSeller) {
      // User can be both - default to buyer dashboard
      window.location.href = '/buyer-dashboard'
    } else if (userWithType.isBuyer) {
      window.location.href = '/buyer-dashboard'
    } else if (userWithType.isSeller) {
      window.location.href = '/seller-dashboard'
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE)
    setUser(null)
    // Redirect to home page
    window.location.href = '/'
  }

  const handleAuthClick = () => {
    setShowAuth(true)
  }

  const handleCloseAuth = () => {
    setShowAuth(false)
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ff6b6b',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <ConditionalLayout
          user={user}
          onLogout={handleLogout}
          onAuthClick={handleAuthClick}
        >
          <Routes>
            <Route path="/" element={
              <>
                <BackgroundAnimation />
                <NepaliWelcomeDialog />
                <main>
                  <EnhancedHero />
                  <Products />
                  <Farmers />
                  <Testimonials />
                  <About />
                </main>
              </>
            } />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/web-tour" element={<WebTourPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Authentication routes */}
            <Route path="/buyer-login" element={<BuyerLogin onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/seller-login" element={<SellerLogin onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/buyer-signup" element={<BuyerSignup onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/seller-signup" element={<SellerSignup onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Checkout and Order routes */}
            <Route path="/checkout" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.BUYER} redirectTo="/buyer-login">
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.BUYER} redirectTo="/buyer-login">
                <OrderSuccess />
              </ProtectedRoute>
            } />
            <Route path="/order-details/:orderId" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.BUYER} redirectTo="/buyer-login">
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/order/:orderId" element={
              <ProtectedRoute user={user} redirectTo="/buyer-login">
                <OrderDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/buyer-dashboard" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.BUYER} redirectTo="/buyer-login">
                <EnhancedBuyerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            <Route path="/seller-dashboard" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.SELLER} redirectTo="/seller-login">
                <EnhancedSellerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ConditionalLayout>

        {/* Main Auth Modal */}
        {showAuth && (
          <MainAuth
            onClose={handleCloseAuth}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* Auth Test Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && <AuthTest />}
      </div>
    </Router>
  )
}

export default App