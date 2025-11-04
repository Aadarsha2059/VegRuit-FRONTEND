import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ compact = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      if (compact) {
        setShowCalendar(false);
      }
    }
  };

  const days = getDaysInMonth(currentDate);

  if (compact) {
    return (
      <div className="calendar-compact">
        <button 
          className="calendar-toggle"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <span className="calendar-icon">📅</span>
          <span className="current-date">{formatDate(selectedDate)}</span>
        </button>
        
        {showCalendar && (
          <div className="calendar-dropdown">
            <div className="calendar-header">
              <button 
                className="nav-btn"
                onClick={() => navigateMonth(-1)}
              >
                ←
              </button>
              <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <button 
                className="nav-btn"
                onClick={() => navigateMonth(1)}
              >
                →
              </button>
            </div>
            
            <div className="calendar-grid">
              {daysOfWeek.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
              
              {days.map((date, index) => (
                <button
                  key={index}
                  className={`day-cell ${date ? 'valid' : 'empty'} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                  onClick={() => handleDateClick(date)}
                  disabled={!date}
                >
                  {date ? date.getDate() : ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-full">
      <div className="calendar-header">
        <button 
          className="nav-btn"
          onClick={() => navigateMonth(-1)}
        >
          ←
        </button>
        <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button 
          className="nav-btn"
          onClick={() => navigateMonth(1)}
        >
          →
        </button>
      </div>
      
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {days.map((date, index) => (
          <button
            key={index}
            className={`day-cell ${date ? 'valid' : 'empty'} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
            disabled={!date}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>
      
      <div className="calendar-footer">
        <p>Selected: {formatDate(selectedDate)}</p>
      </div>
    </div>
  );
};

export default Calendar;