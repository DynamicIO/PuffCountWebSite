import React from 'react';
import { Sun, Moon } from 'lucide-react';

function Header({ tabs, activeTab, setActiveTab, theme, toggleTheme }) {
  const handleLogoClick = () => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header-content">
        <button 
          className="logo logo-button"
          onClick={handleLogoClick}
          title="Go to Dashboard"
        >
          <img src="/logo.png" alt="Puff Tracker Logo" className="logo-image" />
        </button>
        
        <nav className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-tab-emoji">{tab.emoji}</span>
              <span className="nav-tab-text">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Header; 