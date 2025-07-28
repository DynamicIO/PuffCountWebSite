import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Plus, Minus } from 'lucide-react';
import PuffHistory from './PuffHistory';
import 'react-calendar/dist/Calendar.css';
import './CalendarTab.css';

function CalendarTab({ 
  puffData, 
  dailyGoal, 
  costPerUnit, 
  updatePuffCount,
  getTodayPuffs,
  removePuffAtIndex
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to get count from data (handles both old and new formats)
  const getCountFromData = (data) => {
    if (!data) return 0;
    if (typeof data === 'number') return data;
    if (Array.isArray(data)) return data.length;
    return 0;
  };

  const selectedDateString = formatDateString(selectedDate);
  const selectedCount = getCountFromData(puffData[selectedDateString]);

  // Get puffs for the selected date
  const getPuffsForDate = (date) => {
    const dateString = formatDateString(date);
    const dateData = puffData[dateString];
    if (!dateData) return [];
    
    // Handle both old format (number) and new format (array of timestamps)
    if (typeof dateData === 'number') {
      // Convert old format to new format
      const timestamps = [];
      for (let i = 0; i < dateData; i++) {
        timestamps.push(new Date(date).toISOString());
      }
      return timestamps;
    }
    return dateData;
  };

  const selectedDatePuffs = getPuffsForDate(selectedDate);

  const getDateClass = (date) => {
    const dateString = formatDateString(date);
    const count = getCountFromData(puffData[dateString]);
    
    if (count === 0) return '';
    
    if (count <= dailyGoal) return 'calendar-day-good';
    if (count <= dailyGoal * 1.5) return 'calendar-day-warning';
    return 'calendar-day-danger';
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDateString(date);
      const count = getCountFromData(puffData[dateString]);
      
      if (count > 0) {
        return (
          <div className="calendar-tile-content">
            <span className="calendar-count">{count}</span>
          </div>
        );
      }
    }
    return null;
  };

  const incrementCount = () => {
    updatePuffCount(selectedDateString, selectedCount + 1);
  };

  const decrementCount = () => {
    updatePuffCount(selectedDateString, Math.max(0, selectedCount - 1));
  };

  const removePuffAtIndexForDate = (index) => {
    if (removePuffAtIndex) {
      removePuffAtIndex(index, selectedDateString);
    }
  };

  const getSelectedDateInfo = () => {
    const today = new Date();
    const isToday = selectedDateString === formatDateString(today);
    const isOverGoal = selectedCount > dailyGoal;
    
    return {
      isToday,
      isOverGoal,
      formattedDate: selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const dateInfo = getSelectedDateInfo();
  const cost = selectedCount * costPerUnit;
  const saved = selectedCount <= dailyGoal ? (dailyGoal - selectedCount) * costPerUnit : 0;

  return (
    <div className="tab-content">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="text-2xl font-bold mb-4">Calendar View</h2>
          <p className="text-secondary mb-6">
            Click on any date to view or edit that day's data
          </p>
        </div>

        <div className="calendar-grid grid grid-2">
          {/* Calendar Widget */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">Monthly Overview</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) => getDateClass(date)}
              tileContent={getTileContent}
              showNeighboringMonth={false}
              prev2Label={null}
              next2Label={null}
            />
            
            {/* Legend */}
            <div className="calendar-legend mt-4">
              <h4 className="font-semibold mb-2">Legend:</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-dot calendar-day-good"></div>
                  <span>At or below goal</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot calendar-day-warning"></div>
                  <span>Above goal</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot calendar-day-danger"></div>
                  <span>Well above goal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">
              {dateInfo.isToday ? "Today's Details" : "Selected Date"}
            </h3>
            
            <div className="selected-date-info">
              <p className="text-lg font-medium mb-4">{dateInfo.formattedDate}</p>
              
              {/* Count Display/Editor */}
              <div className="count-section mb-6">
                <div className="count-display">
                  <div className="count-number text-3xl font-bold mb-2">
                    {selectedCount}
                  </div>
                </div>
                
                <div className="count-controls">
                  <button 
                    className="btn btn-danger btn-circle"
                    onClick={decrementCount}
                    disabled={selectedCount === 0}
                  >
                    <Minus size={24} />
                  </button>
                  
                  <button 
                    className="btn btn-primary btn-circle"
                    onClick={incrementCount}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              {/* Goal Status */}
              <div className="goal-status mb-4">
                <div className={`status-indicator ${dateInfo.isOverGoal ? 'over-goal' : 'under-goal'}`}>
                  {dateInfo.isOverGoal ? (
                    <>
                      <span className="status-emoji">⚠️</span>
                      <span>{selectedCount - dailyGoal} over goal</span>
                    </>
                  ) : (
                    <>
                      <span className="status-emoji">✅</span>
                      <span>
                        {selectedCount === 0 ? 'No data' : 'Within goal'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Financial Info */}
              {selectedCount > 0 && (
                <div className="financial-info">
                  <div className="info-row">
                    <span>Cost this day:</span>
                    <span className="font-semibold">${cost.toFixed(2)}</span>
                  </div>
                  {saved > 0 && (
                    <div className="info-row text-green-600">
                      <span>Amount saved:</span>
                      <span className="font-semibold">${saved.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Puff History for Selected Date */}
        <div className="mt-6">
          <PuffHistory 
            todayPuffs={selectedDatePuffs}
            removePuffAtIndex={removePuffAtIndexForDate}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarTab; 