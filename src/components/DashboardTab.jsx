import React from 'react';
import { Plus, Minus } from 'lucide-react';
import ProgressCircle from './ProgressCircle';
import StatCard from './StatCard';
import { calculateStats } from '../utils/achievements';

function DashboardTab({ 
  puffData, 
  dailyGoal, 
  costPerUnit, 
  getTodayCount, 
  incrementPuff, 
  decrementPuff
}) {
  const todayCount = getTodayCount();
  const stats = calculateStats(puffData, dailyGoal, costPerUnit);
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const progressPercentage = Math.min((todayCount / dailyGoal) * 100, 100);
  const isOverGoal = todayCount > dailyGoal;
  
  return (
    <div className="tab-content">
      <div className="dashboard-grid">
        {/* Daily Header */}
        <div className="card p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Today's Progress</h2>
          <p className="text-secondary">{getTodayDate()}</p>
        </div>

        {/* Puff Counter Section */}
        <div className="card puff-counter-section">
          <div className="puff-counter">
            <h3 className="text-xl font-semibold mb-4">Daily Count</h3>
            
            <div className="puff-count-display">
              {todayCount}
            </div>
            
            <div className="puff-controls">
              <button 
                className="btn btn-danger btn-circle"
                onClick={() => {
                  console.log('Decrement button clicked!');
                  decrementPuff();
                }}
                disabled={todayCount === 0}
                title="Remove one puff"
              >
                <Minus size={24} />
              </button>
              
              <button 
                className="btn btn-primary btn-circle"
                onClick={() => {
                  console.log('Increment button clicked!');
                  incrementPuff();
                }}
                title="Add one puff"
              >
                <Plus size={24} />
              </button>
            </div>
            
            <div className="text-sm text-secondary mt-4">
              Goal: {dailyGoal} per day
              {isOverGoal && (
                <div className="text-warning mt-2">
                  ⚠️ {todayCount - dailyGoal} over your goal
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="card">
          <ProgressCircle 
            percentage={progressPercentage}
            count={todayCount}
            goal={dailyGoal}
            isOverGoal={isOverGoal}
          />
        </div>

        {/* Statistics Grid */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-6">Statistics Overview</h3>
          <div className="stats-grid">
            <StatCard
              title="Daily Average"
              value={stats.dailyAverage}
              suffix=""
              emoji="📊"
              color="blue"
            />
            <StatCard
              title="Weekly Average"
              value={stats.weeklyAverage}
              suffix=""
              emoji="📅"
              color="green"
            />
            <StatCard
              title="Monthly Average"
              value={stats.monthlyAverage}
              suffix=""
              emoji="📈"
              color="purple"
            />
            <StatCard
              title="Current Streak"
              value={stats.currentStreak}
              suffix=" days"
              emoji="🔥"
              color="orange"
            />
            <StatCard
              title="Total Cost"
              value={`$${stats.totalCost}`}
              suffix=""
              emoji="💸"
              color="red"
            />
            <StatCard
              title="Money Saved"
              value={`$${stats.totalSaved}`}
              suffix=""
              emoji="💰"
              color="green"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-4">
            <button 
              className={`btn ${todayCount <= dailyGoal ? 'btn-success' : 'btn-warning'} text-center`}
            >
              {todayCount <= dailyGoal ? '✅ On Track Today!' : '⚠️ Over Goal Today'}
            </button>
            
            <div className="text-sm text-secondary text-center">
              <p>Today's cost: ${(todayCount * costPerUnit).toFixed(2)}</p>
              {todayCount <= dailyGoal && (
                <p className="text-green-600 mt-1">
                  Saved: ${((dailyGoal - todayCount) * costPerUnit).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default DashboardTab; 