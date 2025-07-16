import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import CalendarTab from './components/CalendarTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import AchievementNotification from './components/AchievementNotification';
import { useLocalStorage } from './hooks/useLocalStorage';
import { checkAchievements } from './utils/achievements';
import './App.css';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'calendar', label: 'Calendar', emoji: '📅' },
  { id: 'reports', label: 'Reports', emoji: '📈' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [puffData, setPuffData] = useLocalStorage('puffData', {});
  const [dailyGoal, setDailyGoal] = useLocalStorage('dailyGoal', 10);
  const [costPerUnit, setCostPerUnit] = useLocalStorage('costPerUnit', 5);
  const [achievements, setAchievements] = useLocalStorage('achievements', {});
  const [newAchievement, setNewAchievement] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check for new achievements when puff data changes
  useEffect(() => {
    const newUnlockedAchievements = checkAchievements(puffData, dailyGoal, costPerUnit, achievements);
    if (Object.keys(newUnlockedAchievements).length > 0) {
      setAchievements(prev => ({ ...prev, ...newUnlockedAchievements }));
      
      // Show notification for the first new achievement
      const firstNewAchievement = Object.keys(newUnlockedAchievements)[0];
      setNewAchievement(firstNewAchievement);
    }
  }, [puffData, dailyGoal, costPerUnit, achievements, setAchievements]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTodayCount = () => {
    const today = getTodayString();
    return puffData[today] || 0;
  };

  const updatePuffCount = (date, count) => {
    console.log('updatePuffCount called with date:', date, 'count:', count);
    console.log('Current puffData before update:', puffData);
    setPuffData(prev => {
      const newData = {
        ...prev,
        [date]: Math.max(0, count)
      };
      console.log('New puffData after update:', newData);
      return newData;
    });
  };

  const incrementPuff = (date = getTodayString()) => {
    console.log('incrementPuff called with date:', date);
    const currentCount = puffData[date] || 0;
    console.log('Current count before increment:', currentCount);
    updatePuffCount(date, currentCount + 1);
    console.log('New count should be:', currentCount + 1);
  };

  const decrementPuff = (date = getTodayString()) => {
    console.log('decrementPuff called with date:', date);
    const currentCount = puffData[date] || 0;
    console.log('Current count before decrement:', currentCount);
    updatePuffCount(date, Math.max(0, currentCount - 1));
    console.log('New count should be:', Math.max(0, currentCount - 1));
  };

  const resetAllData = () => {
    setPuffData({});
    setAchievements({});
  };

  const renderActiveTab = () => {
    const commonProps = {
      puffData,
      dailyGoal,
      costPerUnit,
      achievements,
      getTodayCount,
      incrementPuff,
      decrementPuff,
      updatePuffCount
    };

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab {...commonProps} />;
      case 'calendar':
        return <CalendarTab {...commonProps} />;
      case 'reports':
        return <ReportsTab {...commonProps} />;
      case 'settings':
        return (
          <SettingsTab
            {...commonProps}
            theme={theme}
            toggleTheme={toggleTheme}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            costPerUnit={costPerUnit}
            setCostPerUnit={setCostPerUnit}
            resetAllData={resetAllData}
          />
        );
      default:
        return <DashboardTab {...commonProps} />;
    }
  };

  return (
    <div className="app">
      <Header 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="main-content">
        <div className="container">
          {renderActiveTab()}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Powered by <span className="footer-brand">Dynamic.IO</span></p>
        </div>
      </footer>

      {newAchievement && (
        <AchievementNotification
          achievementId={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
}

export default App; 