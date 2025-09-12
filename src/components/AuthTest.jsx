import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { authAPI, USER_TYPES, STORAGE_KEYS } from '../services/authAPI'

const AuthTest = () => {
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date().toLocaleTimeString() }])
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    try {
      // Test 1: Buyer Registration
      addResult('Buyer Registration', null, 'Testing buyer registration...')
      const buyerData = {
        username: `testbuyer_${Date.now()}`,
        email: `testbuyer_${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'Buyer',
        phone: '+977-9841234567',
        address: 'Test Address, Ward 5',
        city: 'Kathmandu'
      }

      const buyerRegResponse = await authAPI.registerBuyer(buyerData)
      if (buyerRegResponse.success) {
        addResult('Buyer Registration', true, `✅ Buyer registered successfully. UserType: ${buyerRegResponse.userType}`)
        
        // Test navigation logic
        if (buyerRegResponse.userType === USER_TYPES.BUYER) {
          addResult('Buyer Navigation', true, '✅ Buyer should navigate to /buyer-dashboard')
        } else {
          addResult('Buyer Navigation', false, `❌ Expected buyer userType, got: ${buyerRegResponse.userType}`)
        }
      } else {
        addResult('Buyer Registration', false, `❌ ${buyerRegResponse.message}`)
      }

      // Test 2: Seller Registration
      addResult('Seller Registration', null, 'Testing seller registration...')
      const sellerData = {
        username: `testseller_${Date.now()}`,
        email: `testseller_${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'Seller',
        phone: '+977-9841234568',
        farmName: 'Test Farm',
        farmLocation: 'Test Farm Location',
        city: 'Kathmandu'
      }

      const sellerRegResponse = await authAPI.registerSeller(sellerData)
      if (sellerRegResponse.success) {
        addResult('Seller Registration', true, `✅ Seller registered successfully. UserType: ${sellerRegResponse.userType}`)
        
        // Test navigation logic
        if (sellerRegResponse.userType === USER_TYPES.SELLER) {
          addResult('Seller Navigation', true, '✅ Seller should navigate to /seller-dashboard')
        } else {
          addResult('Seller Navigation', false, `❌ Expected seller userType, got: ${sellerRegResponse.userType}`)
        }
      } else {
        addResult('Seller Registration', false, `❌ ${sellerRegResponse.message}`)
      }

      // Test 3: Login Test (using the registered buyer)
      addResult('Login Test', null, 'Testing login functionality...')
      const loginResponse = await authAPI.loginBuyer({
        username: buyerData.username,
        password: buyerData.password
      })

      if (loginResponse.success) {
        addResult('Login Test', true, `✅ Login successful. UserType: ${loginResponse.userType}`)
        
        // Test token storage
        if (loginResponse.token) {
          addResult('Token Generation', true, '✅ JWT token generated successfully')
        } else {
          addResult('Token Generation', false, '❌ No JWT token in response')
        }
      } else {
        addResult('Login Test', false, `❌ ${loginResponse.message}`)
      }

      addResult('All Tests', true, '🎉 All authentication tests completed!')

    } catch (error) {
      addResult('Test Error', false, `❌ Test failed: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      left: '20px', 
      width: '350px', 
      background: 'white', 
      border: '2px solid #4caf50', 
      borderRadius: '12px', 
      padding: '16px',
      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)',
      zIndex: 1000,
      maxHeight: '60vh',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ 
        margin: '0 0 12px', 
        color: '#2d5a27', 
        fontSize: '1.1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🧪 Auth Test Panel
        <span style={{ 
          fontSize: '0.7rem', 
          background: '#4caf50', 
          color: 'white', 
          padding: '2px 6px', 
          borderRadius: '4px' 
        }}>
          DEV
        </span>
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runTests} 
          disabled={isRunning}
          style={{
            padding: '8px 16px',
            background: isRunning ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isRunning ? '⏳ Running...' : '🚀 Run Tests'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear
        </button>
      </div>

      <div style={{ 
        maxHeight: '300px', 
        overflow: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#4caf50 #f0f0f0'
      }}>
        {testResults.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              padding: '8px', 
              margin: '5px 0', 
              borderRadius: '4px',
              background: result.success === true ? '#e8f5e8' : 
                         result.success === false ? '#ffe8e8' : '#f0f0f0',
              border: `1px solid ${result.success === true ? '#4caf50' : 
                                 result.success === false ? '#ff6b6b' : '#ccc'}`,
              fontSize: '12px'
            }}
          >
            <strong>{result.test}</strong> <small>({result.timestamp})</small>
            <br />
            {result.message}
          </div>
        ))}
      </div>

      {testResults.length === 0 && (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
          Click "Run Tests" to verify authentication flow
        </p>
      )}
    </div>
  )
}

export default AuthTest