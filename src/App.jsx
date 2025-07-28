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
    const todayData = puffData[today];
    if (!todayData) return 0;
    
    // Handle both old format (number) and new format (array of timestamps)
    if (typeof todayData === 'number') {
      return todayData;
    }
    return todayData.length || 0;
  };

  const getTodayPuffs = () => {
    const today = getTodayString();
    const todayData = puffData[today];
    if (!todayData) return [];
    
    // Handle both old format (number) and new format (array of timestamps)
    if (typeof todayData === 'number') {
      // Convert old format to new format
      const timestamps = [];
      for (let i = 0; i < todayData; i++) {
        timestamps.push(new Date().toISOString());
      }
      return timestamps;
    }
    return todayData;
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

  const addPuff = (date = getTodayString()) => {
    console.log('addPuff called with date:', date);
    const timestamp = new Date().toISOString();
    
    setPuffData(prev => {
      const existingData = prev[date];
      let newPuffs;
      
      if (!existingData) {
        // No data for this date, create new array
        newPuffs = [timestamp];
      } else if (typeof existingData === 'number') {
        // Convert old format to new format
        newPuffs = Array(existingData).fill().map(() => new Date().toISOString());
        newPuffs.push(timestamp);
      } else {
        // Already in new format, add to existing array
        newPuffs = [...existingData, timestamp];
      }
      
      const newData = {
        ...prev,
        [date]: newPuffs
      };
      console.log('New puffData after adding puff:', newData);
      return newData;
    });
  };

  const removePuff = (date = getTodayString()) => {
    console.log('removePuff called with date:', date);
    
    setPuffData(prev => {
      const existingData = prev[date];
      if (!existingData) return prev;
      
      let newPuffs;
      if (typeof existingData === 'number') {
        // Convert old format to new format
        if (existingData <= 0) return prev;
        newPuffs = Array(existingData - 1).fill().map(() => new Date().toISOString());
      } else {
        // Already in new format, remove last puff
        if (existingData.length <= 0) return prev;
        newPuffs = existingData.slice(0, -1);
      }
      
      const newData = {
        ...prev,
        [date]: newPuffs
      };
      console.log('New puffData after removing puff:', newData);
      return newData;
    });
  };

  const removePuffAtIndex = (index, date = getTodayString()) => {
    console.log('removePuffAtIndex called with index:', index, 'date:', date);
    
    setPuffData(prev => {
      const existingData = prev[date];
      if (!existingData) return prev;
      
      let newPuffs;
      if (typeof existingData === 'number') {
        // Convert old format to new format first
        newPuffs = Array(existingData).fill().map(() => new Date().toISOString());
      } else {
        newPuffs = [...existingData];
      }
      
      // Remove the puff at the specified index
      if (index >= 0 && index < newPuffs.length) {
        newPuffs.splice(index, 1);
      }
      
      const newData = {
        ...prev,
        [date]: newPuffs
      };
      console.log('New puffData after removing puff at index:', newData);
      return newData;
    });
  };

  // Keep the old functions for backward compatibility
  const incrementPuff = (date = getTodayString()) => {
    console.log('incrementPuff called with date:', date);
    addPuff(date);
  };

  const decrementPuff = (date = getTodayString()) => {
    console.log('decrementPuff called with date:', date);
    removePuff(date);
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
      getTodayPuffs,
      incrementPuff,
      decrementPuff,
      addPuff,
      removePuff,
      removePuffAtIndex,
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