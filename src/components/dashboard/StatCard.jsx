import React from 'react'
import './StatCard.css'

const StatCard = ({ 
  title, 
  value, 
  label, 
  icon, 
  color = 'primary', 
  trend, 
  trendValue,
  onClick 
}) => {
  return (
    <div 
      className={`stat-card ${color} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-header">
        <div className="stat-icon">
          {icon}
        </div>
        {trend && (
          <div className={`stat-trend ${trend}`}>
            <span className="trend-icon">
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
            <span className="trend-value">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {label && <div className="stat-label">{label}</div>}
      </div>
    </div>
  )
}

export default StatCard