import React, { useState } from 'react';
import { Plus, Minus, Sun, Moon, Trash2, Award, Star, AlertTriangle } from 'lucide-react';
import { ACHIEVEMENTS, getAchievementProgress } from '../utils/achievements';

function SettingsTab({ 
  theme, 
  toggleTheme, 
  dailyGoal, 
  setDailyGoal, 
  costPerUnit, 
  setCostPerUnit, 
  resetAllData, 
  achievements,
  puffData
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const adjustGoal = (change) => {
    const newGoal = Math.max(1, dailyGoal + change);
    setDailyGoal(newGoal);
  };

  const adjustCost = (change) => {
    const newCost = Math.max(0.25, (costPerUnit + change));
    setCostPerUnit(Math.round(newCost * 100) / 100); // Round to 2 decimal places
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  const getAchievementStatus = (achievementId) => {
    const isUnlocked = achievements[achievementId];
    const progress = getAchievementProgress(achievementId, puffData, dailyGoal, costPerUnit);
    
    return {
      isUnlocked,
      progress,
      unlockedAt: isUnlocked ? achievements[achievementId].unlockedAt : null
    };
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const unlockedCount = Object.keys(achievements).length;
  const totalCount = Object.keys(ACHIEVEMENTS).length;

  return (
    <div className="tab-content">
      <div className="settings-container">
        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
        
        <div className="settings-grid grid grid-2">
          {/* Goal Settings */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span>
              Daily Goal
            </h3>
            <div className="setting-item">
              <div className="setting-controls">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
                >
                  <Minus size={24} />
                </button>
                
                <span className="setting-value">{dailyGoal} per day</span>
                
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setDailyGoal(dailyGoal + 1)}
                >
                  <Plus size={24} />
                </button>
              </div>
              <p className="setting-description">
                Set your daily consumption goal. Lower goals help track reduction progress.
              </p>
            </div>
          </div>

          {/* Cost Settings */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>💰</span>
              Cost Per Unit
            </h3>
            <div className="setting-item">
              <div className="setting-controls">
                <button 
                  className="btn btn-secondary btn-circle"
                  onClick={() => adjustCost(-0.25)}
                  disabled={costPerUnit <= 0.25}
                >
                  <Minus size={24} />
                </button>
                <div className="setting-value">
                  <span className="value-number">${costPerUnit.toFixed(2)}</span>
                  <span className="value-label">per unit</span>
                </div>
                <button 
                  className="btn btn-primary btn-circle"
                  onClick={() => adjustCost(0.25)}
                >
                  <Plus size={24} />
                </button>
              </div>
              <p className="setting-description">
                Set the cost per unit to track spending and calculate savings.
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🎨</span>
              Appearance
            </h3>
            <div className="setting-item">
              <div className="theme-toggle-container">
                <button 
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  <Sun size={24} />
                  <span>Light Mode</span>
                </button>
                <button 
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  <Moon size={24} />
                  <span>Dark Mode</span>
                </button>
              </div>
              <p className="setting-description">
                Choose your preferred color scheme for the interface.
              </p>
            </div>
          </div>

          {/* Data Management */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🗂️</span>
              Data Management
            </h3>
            <div className="setting-item">
              <div className="data-actions">
                {!showResetConfirm ? (
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    <Trash2 size={20} />
                    Reset All Data
                  </button>
                ) : (
                  <div className="reset-confirm">
                    <div className="warning-message">
                      <AlertTriangle size={20} />
                      <span>This will permanently delete all your data!</span>
                    </div>
                    <div className="confirm-buttons">
                      <button 
                        className="btn btn-danger"
                        onClick={handleReset}
                      >
                        Yes, Reset All
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="setting-description">
                Reset all tracking data while preserving your settings.
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Gallery */}
        <div className="achievements-section">
          <div className="achievements-header">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Award size={24} />
              Achievements ({unlockedCount}/{totalCount})
            </h3>
            <div className="achievement-progress-bar">
              <div 
                className="achievement-progress-fill"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          <div className="achievements-grid">
            {Object.values(ACHIEVEMENTS).map(achievement => {
              const status = getAchievementStatus(achievement.id);
              
              return (
                <div 
                  key={achievement.id}
                  className={`achievement-card ${status.isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    <span className="achievement-emoji">{achievement.emoji}</span>
                    {status.isUnlocked && (
                      <div className="unlock-badge">
                        <Star size={16} />
                      </div>
                    )}
                  </div>
                  
                  <div className="achievement-info">
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                    
                    {status.isUnlocked ? (
                      <div className="unlock-date">
                        Unlocked on {formatDate(status.unlockedAt)}
                      </div>
                    ) : (
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${status.progress.percentage}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          {status.progress.current} / {status.progress.target}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* App Info */}
        <div className="app-info card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>ℹ️</span>
            About Puff Tracker
          </h3>
          <div className="info-content">
            <p className="info-text">
              Puff Tracker helps you monitor and manage your daily consumption with 
              comprehensive analytics, goal setting, and progress visualization.
            </p>
            <div className="info-features">
              <div className="feature-item">
                <span className="feature-emoji">📊</span>
                <span>Real-time tracking with visual progress indicators</span>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">📅</span>
                <span>Interactive calendar with color-coded consumption levels</span>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">🏆</span>
                <span>Achievement system to motivate healthy habits</span>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">💾</span>
                <span>All data stored locally on your device</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsTab; 