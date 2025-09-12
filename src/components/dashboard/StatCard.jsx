import React from 'react';

const StatCard = ({ title, value, label, icon, trend, color = 'primary' }) => {
  return (
    <div className={`stat-card ${color}`}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
        <span className="stat-label">{label}</span>
        {trend && (
          <div className={`stat-trend ${trend.type}`}>
            {trend.type === 'up' ? '📈' : '📉'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;