import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/achievements';
import './AchievementNotification.css';

function AchievementNotification({ achievementId, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const achievement = ACHIEVEMENTS[achievementId];

  useEffect(() => {
    // Show the notification with animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!achievement) return null;

  return (
    <div className={`achievement-notification-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`achievement-notification ${isVisible ? 'visible' : ''}`}>
        <div className="achievement-content">
          {/* Close button */}
          <button 
            className="achievement-close"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <X size={20} />
          </button>

          {/* Achievement header */}
          <div className="achievement-header">
            <div className="achievement-badge">
              <div className="achievement-emoji">{achievement.emoji}</div>
            </div>
            <div className="achievement-text">
              <h3 className="achievement-title">Achievement Unlocked!</h3>
              <h4 className="achievement-name">{achievement.title}</h4>
              <p className="achievement-description">{achievement.description}</p>
            </div>
          </div>

          {/* Celebration animation */}
          <div className="achievement-celebration">
            <div className="confetti-container">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`confetti confetti-${i + 1}`}>🎉</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementNotification; 