import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import './PuffHistory.css';

function PuffHistory({ todayPuffs, removePuffAtIndex, selectedDate }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const puffTime = new Date(timestamp);
    const diffMs = now - puffTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatTime(timestamp);
  };

  const handleRemovePuff = (index) => {
    if (removePuffAtIndex) {
      removePuffAtIndex(index);
    }
  };

  const isToday = selectedDate ? new Date(selectedDate).toDateString() === new Date().toDateString() : true;
  const dateDisplay = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'today';

  if (!todayPuffs || todayPuffs.length === 0) {
    return (
      <div className="puff-history empty">
        <div className="empty-state">
          <Clock size={48} className="empty-icon" />
          <p className="empty-text">No puffs logged {isToday ? 'today' : `on ${dateDisplay}`}</p>
          <p className="empty-subtext">Start tracking your puffs to see your history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="puff-history">
      <div className="history-header">
        <h3 className="history-title">
          <Clock size={20} />
          {isToday ? "Today's" : `${dateDisplay}'s`} Puff History
        </h3>
        <span className="history-count">{todayPuffs.length} puffs</span>
      </div>
      
      <div className="history-list">
        {todayPuffs.map((timestamp, index) => (
          <div key={`${timestamp}-${index}`} className="history-item">
            <div className="history-time">
              <span className="time-display">{formatTime(timestamp)}</span>
              <span className="time-ago">{formatTimeAgo(timestamp)}</span>
            </div>
            
            <div className="history-actions">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemovePuff(index)}
                title="Remove this puff"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {todayPuffs.length > 0 && (
        <div className="history-summary">
          <div className="summary-item">
            <span className="summary-label">First puff:</span>
            <span className="summary-value">{formatTime(todayPuffs[0])}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Last puff:</span>
            <span className="summary-value">{formatTime(todayPuffs[todayPuffs.length - 1])}</span>
          </div>
          {todayPuffs.length > 1 && (
            <div className="summary-item">
              <span className="summary-label">Average interval:</span>
              <span className="summary-value">
                {Math.round((new Date(todayPuffs[todayPuffs.length - 1]) - new Date(todayPuffs[0])) / (1000 * 60 * (todayPuffs.length - 1)))}m
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PuffHistory; 