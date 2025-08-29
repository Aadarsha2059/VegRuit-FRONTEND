import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import Dashboard from './pages/Dashboard'
import { STORAGE_KEYS } from './services/authAPI'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Check for existing user data and token
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    
    if (userData && token) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
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
        
        <Header 
          user={user} 
          onLogout={handleLogout} 
          onAuthClick={handleAuthClick}
        />
        
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
          <Route path="/dashboard" element={
            user && user.userType === 'buyer' ? 
              <Dashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } />
          <Route path="/seller-dashboard" element={
            user && user.userType === 'seller' ? 
              <Dashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } />
        </Routes>
        
        <Footer />

        {/* Auth Modal */}
        {showAuth && (
          <Auth
            onClose={handleCloseAuth}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </Router>
  )
}

export default App
