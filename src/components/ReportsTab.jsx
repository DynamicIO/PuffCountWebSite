import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ReportsTab({ puffData, dailyGoal, costPerUnit }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Helper function to get count from data (handles both old and new formats)
  const getCountFromData = (data) => {
    if (!data) return 0;
    if (typeof data === 'number') return data;
    if (Array.isArray(data)) return data.length;
    return 0;
  };

  // Generate month data
  const monthData = useMemo(() => {
    const year = selectedYear;
    const month = selectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const dailyData = [];
    let totalPuffs = 0;
    let totalCost = 0;
    let totalSaved = 0;
    let daysWithData = 0;
    let daysUnderGoal = 0;
    let daysOverGoal = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const count = getCountFromData(puffData[dateString]);
      
      if (count > 0) {
        daysWithData++;
        if (count <= dailyGoal) {
          daysUnderGoal++;
          totalSaved += (dailyGoal - count) * costPerUnit;
        } else {
          daysOverGoal++;
        }
      }
      
      totalPuffs += count;
      totalCost += count * costPerUnit;
      
      dailyData.push({
        day,
        date: dateString,
        count,
        cost: count * costPerUnit,
        isOverGoal: count > dailyGoal,
        formattedDate: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      });
    }

    const averagePerDay = daysWithData > 0 ? totalPuffs / daysWithData : 0;
    const averagePerDayAll = totalPuffs / daysInMonth;

    return {
      monthName,
      dailyData,
      totalPuffs,
      totalCost,
      totalSaved,
      daysWithData,
      daysUnderGoal,
      daysOverGoal,
      averagePerDay,
      averagePerDayAll,
      daysInMonth
    };
  }, [selectedYear, selectedMonth, puffData, dailyGoal, costPerUnit]);

  // Chart configuration
  const chartData = {
    labels: monthData.dailyData.map(d => d.formattedDate),
    datasets: [
      {
        label: 'Daily Count',
        data: monthData.dailyData.map(d => d.count),
        backgroundColor: monthData.dailyData.map(d => {
          if (d.count === 0) return 'var(--border-color)';
          if (d.isOverGoal) return 'var(--accent-red)';
          return 'var(--accent-blue)';
        }),
        borderColor: monthData.dailyData.map(d => {
          if (d.count === 0) return 'var(--border-color)';
          if (d.isOverGoal) return 'var(--accent-red)';
          return 'var(--accent-blue)';
        }),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataPoint = monthData.dailyData[context.dataIndex];
            return [
              `Count: ${dataPoint.count}`,
              `Cost: $${dataPoint.cost.toFixed(2)}`,
              `Goal: ${dailyGoal}`,
              dataPoint.isOverGoal ? 'Over goal' : 'Within goal'
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--border-color)'
        },
        ticks: {
          color: 'var(--text-secondary)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-secondary)',
          maxRotation: 45
        }
      }
    }
  };

  const navigateMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const getSuccessRate = () => {
    const rate = monthData.daysWithData > 0 ? (monthData.daysUnderGoal / monthData.daysWithData) * 100 : 0;
    return Math.round(rate);
  };

  const getTrendData = () => {
    // Get data from last month for comparison
    const lastMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const lastYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const lastMonthDays = new Date(lastYear, lastMonth + 1, 0).getDate();
    
    let lastMonthTotal = 0;
    let lastMonthDaysWithData = 0;
    
    for (let day = 1; day <= lastMonthDays; day++) {
      const date = new Date(lastYear, lastMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const count = puffData[dateString] || 0;
      if (count > 0) {
        lastMonthDaysWithData++;
      }
      lastMonthTotal += count;
    }
    
    const lastMonthAverage = lastMonthDaysWithData > 0 ? lastMonthTotal / lastMonthDaysWithData : 0;
    const currentAverage = monthData.averagePerDay;
    const difference = currentAverage - lastMonthAverage;
    const isImproving = difference < 0; // Lower is better
    
    return {
      difference: Math.abs(difference),
      isImproving,
      lastMonthAverage
    };
  };

  const trendData = getTrendData();

  return (
    <div className="tab-content">
      <div className="reports-container">
        {/* Header with Month Navigation */}
        <div className="reports-header">
          <div className="month-navigation">
            <button className="btn btn-secondary" onClick={() => navigateMonth(-1)}>
              <ChevronLeft size={20} />
              Previous
            </button>
            <h2 className="text-2xl font-bold">{monthData.monthName} Report</h2>
            <button className="btn btn-secondary" onClick={() => navigateMonth(1)}>
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="reports-grid grid grid-3">
          <div className="card p-6">
            <div className="stat-card text-center">
              <div className="stat-emoji text-2xl mb-2">📊</div>
              <div className="stat-value">{monthData.totalPuffs}</div>
              <div className="stat-label">Total This Month</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="stat-card text-center">
              <div className="stat-emoji text-2xl mb-2">📈</div>
              <div className="stat-value">{monthData.averagePerDay.toFixed(1)}</div>
              <div className="stat-label">Daily Average</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="stat-card text-center">
              <div className="stat-emoji text-2xl mb-2">🎯</div>
              <div className="stat-value">{getSuccessRate()}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-6">Daily Breakdown</h3>
          <div className="chart-container" style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="chart-legend mt-4">
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'var(--accent-blue)' }}></div>
                <span>Within goal</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'var(--accent-red)' }}></div>
                <span>Over goal</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'var(--border-color)' }}></div>
                <span>No data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="analytics-grid grid grid-2">
          {/* Financial Summary */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">💰 Financial Summary</h3>
            <div className="financial-breakdown">
              <div className="financial-row">
                <span>Total Cost:</span>
                <span className="font-semibold text-red-600">${monthData.totalCost.toFixed(2)}</span>
              </div>
              <div className="financial-row">
                <span>Amount Saved:</span>
                <span className="font-semibold text-green-600">${monthData.totalSaved.toFixed(2)}</span>
              </div>
              <div className="financial-row">
                <span>Average Cost/Day:</span>
                <span className="font-semibold">${(monthData.totalCost / monthData.daysInMonth).toFixed(2)}</span>
              </div>
              <div className="financial-row">
                <span>Goal Cost/Day:</span>
                <span className="font-semibold">${(dailyGoal * costPerUnit).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">📊 Performance Analysis</h3>
            <div className="performance-stats">
              <div className="performance-row">
                <span>Days with data:</span>
                <span className="font-semibold">{monthData.daysWithData} / {monthData.daysInMonth}</span>
              </div>
              <div className="performance-row">
                <span>Days under goal:</span>
                <span className="font-semibold text-green-600">{monthData.daysUnderGoal}</span>
              </div>
              <div className="performance-row">
                <span>Days over goal:</span>
                <span className="font-semibold text-red-600">{monthData.daysOverGoal}</span>
              </div>
              <div className="performance-row">
                <span>Success rate:</span>
                <span className="font-semibold">{getSuccessRate()}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">📈 Trend Analysis</h3>
          <div className="trend-analysis">
            <div className="trend-indicator">
              {trendData.isImproving ? (
                <div className="trend-positive">
                  <TrendingDown className="trend-icon" size={24} />
                  <span className="trend-text">
                    Improving! Down {trendData.difference.toFixed(1)} from last month
                  </span>
                </div>
              ) : (
                <div className="trend-negative">
                  <TrendingUp className="trend-icon" size={24} />
                  <span className="trend-text">
                    Up {trendData.difference.toFixed(1)} from last month
                  </span>
                </div>
              )}
            </div>
            <div className="trend-details text-sm text-secondary mt-2">
              Last month average: {trendData.lastMonthAverage.toFixed(1)} per day
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsTab; 