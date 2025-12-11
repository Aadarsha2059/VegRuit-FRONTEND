import React, { useState, useEffect } from 'react';

const StatsTest = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats from API...');
        const response = await fetch('http://localhost:5001/api/stats/homepage');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Stats data received:', data);
          setStats(data);
        } else {
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>API Stats Test</h3>
      {stats ? (
        <div>
          <p>✅ API Connection: Working</p>
          <p>👥 Total Buyers: {stats.totalBuyers}</p>
          <p>🌾 Total Sellers: {stats.totalSellers}</p>
          <p>📦 Total Products: {stats.totalProducts}</p>
          <p>🛒 Total Orders: {stats.totalOrders}</p>
        </div>
      ) : (
        <p>❌ No data received</p>
      )}
    </div>
  );
};

export default StatsTest;