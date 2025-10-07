import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-text">{message}</div>
      </div>
    </div>
  )
}

export default LoadingSpinner