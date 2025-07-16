import React from 'react';

function ProgressCircle({ percentage, count, goal, isOverGoal }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getStrokeColor = () => {
    if (isOverGoal) return 'var(--accent-red)';
    if (percentage >= 80) return 'var(--accent-yellow)';
    if (percentage >= 50) return 'var(--accent-blue)';
    return 'var(--accent-green)';
  };

  const getStatusEmoji = () => {
    if (isOverGoal) return '😰';
    if (percentage >= 80) return '😬';
    if (percentage >= 50) return '😐';
    return '😊';
  };

  const getStatusText = () => {
    if (isOverGoal) return 'Over Goal';
    if (percentage >= 80) return 'Almost There';
    if (percentage >= 50) return 'Halfway';
    return 'Good Progress';
  };

  return (
    <div className="progress-circle-container">
      <h3 className="text-xl font-semibold mb-4">Daily Progress</h3>
      
      <div className="progress-circle">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            className="progress-circle-bg"
            cx="100"
            cy="100"
            r={radius}
          />
          
          {/* Progress circle */}
          <circle
            className="progress-circle-fill"
            cx="100"
            cy="100"
            r={radius}
            style={{
              strokeDasharray,
              strokeDashoffset,
              stroke: getStrokeColor()
            }}
          />
        </svg>
        
        <div className="progress-circle-text">
          <div className="progress-percentage">
            {Math.round(percentage)}%
          </div>
          <div className="progress-label">
            {count} / {goal}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <div className="text-2xl mb-2">{getStatusEmoji()}</div>
        <div className="text-lg font-semibold">{getStatusText()}</div>
        <div className="text-sm text-secondary mt-2">
          {isOverGoal 
            ? `${count - goal} over your daily goal`
            : `${goal - count} remaining today`
          }
        </div>
      </div>
    </div>
  );
}

export default ProgressCircle; 