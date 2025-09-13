import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Farmers from './components/Farmers'
import Testimonials from './components/Testimonials'
import Explore from './components/Explore'
import About from './components/About'
import Footer from './components/Footer'
import Auth from './components/auth/Auth'
import ProtectedRoute from './components/ProtectedRoute'
import AuthTest from './components/AuthTest'
import BuyerDashboard from './pages/BuyerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import { STORAGE_KEYS, USER_TYPES } from './services/authAPI'
import './App.css'

// Component to conditionally render header and footer
const ConditionalLayout = ({ user, onLogout, onAuthClick, children }) => {
  const location = useLocation()
  const isDashboard = location.pathname.includes('dashboard')
  
  return (
    <>
      {!isDashboard && (
        <Header 
          user={user} 
          onLogout={onLogout} 
          onAuthClick={onAuthClick}
        />
      )}
      {children}
      {!isDashboard && <Footer />}
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
      userType: userData.userType || localStorage.getItem(STORAGE_KEYS.USER_TYPE)
    }
    setUser(userWithType)
    setShowAuth(false)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE)
    setUser(null)
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
              <main>
                <Hero />
                <Products />
                <Farmers />
                <Testimonials />
                <Explore />
                <About />
              </main>
            } />
            <Route path="/buyer-dashboard" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.BUYER}>
                <BuyerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            <Route path="/seller-dashboard" element={
              <ProtectedRoute user={user} requiredUserType={USER_TYPES.SELLER}>
                <SellerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } />
          </Routes>
        </ConditionalLayout>

        {/* Auth Modal */}
        {showAuth && (
          <Auth
            onClose={handleCloseAuth}
            onSuccess={handleAuthSuccess}
          />
        )}

        {/* Auth Test Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && <AuthTest />}
      </div>
    </Router>
  )
}

export default App
