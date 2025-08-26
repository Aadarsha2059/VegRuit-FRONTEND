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
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('vegruit_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setShowLoginModal(false)
  }

  const handleSignUpSuccess = (userData) => {
    setUser(userData)
    setShowSignUpModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('vegruit_user')
    setUser(null)
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
          onLoginClick={() => setShowLoginModal(true)}
          onSignUpClick={() => setShowSignUpModal(true)}
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
            user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          } />
        </Routes>
        
        <Footer />

        {/* Login Modal */}
        {showLoginModal && (
          <Login 
            onClose={() => setShowLoginModal(false)}
            onSuccess={handleLoginSuccess}
            onSwitchToSignUp={() => {
              setShowLoginModal(false)
              setShowSignUpModal(true)
            }}
          />
        )}

        {/* Sign Up Modal */}
        {showSignUpModal && (
          <SignUp 
            onClose={() => setShowSignUpModal(false)}
            onSuccess={handleSignUpSuccess}
            onSwitchToLogin={() => {
              setShowSignUpModal(false)
              setShowLoginModal(true)
            }}
          />
        )}
      </div>
    </Router>
  )
}

export default App
