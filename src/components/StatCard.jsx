import React from 'react';

function StatCard({ title, value, suffix = '', emoji, color = 'blue' }) {
  const getColorClass = () => {
    switch (color) {
      case 'green': return 'stat-card-green';
      case 'red': return 'stat-card-red';
      case 'yellow': return 'stat-card-yellow';
      case 'purple': return 'stat-card-purple';
      case 'orange': return 'stat-card-orange';
      default: return 'stat-card-blue';
    }
  };

  return (
    <div className={`stat-card ${getColorClass()}`}>
      <div className="stat-emoji text-2xl mb-2">{emoji}</div>
      <div className="stat-value">
        {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
        {suffix}
      </div>
      <div className="stat-label">{title}</div>
    </div>
  );
}

export default StatCard; 