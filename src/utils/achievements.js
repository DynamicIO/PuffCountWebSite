// Achievement definitions
export const ACHIEVEMENTS = {
  firstStep: {
    id: 'firstStep',
    title: 'First Step',
    description: 'Log your first puff',
    emoji: '👶',
    condition: (puffData) => {
      return Object.values(puffData).some(data => getCountFromData(data) > 0);
    }
  },
  goalCrusher: {
    id: 'goalCrusher',
    title: 'Goal Crusher',
    description: 'Stay under daily goal',
    emoji: '🎯',
    condition: (puffData, dailyGoal) => {
      const today = new Date().toISOString().split('T')[0];
      const todayCount = getCountFromData(puffData[today] || 0);
      return todayCount > 0 && todayCount <= dailyGoal;
    }
  },
  buildingHabits: {
    id: 'buildingHabits',
    title: 'Building Habits',
    description: '3-day streak under goal',
    emoji: '🔥',
    condition: (puffData, dailyGoal) => {
      return checkStreak(puffData, dailyGoal, 3);
    }
  },
  weekWarrior: {
    id: 'weekWarrior',
    title: 'Week Warrior',
    description: '7-day streak under goal',
    emoji: '⚔️',
    condition: (puffData, dailyGoal) => {
      return checkStreak(puffData, dailyGoal, 7);
    }
  },
  monthlyMaster: {
    id: 'monthlyMaster',
    title: 'Monthly Master',
    description: '30-day streak under goal',
    emoji: '👑',
    condition: (puffData, dailyGoal) => {
      return checkStreak(puffData, dailyGoal, 30);
    }
  },
  moneySaver: {
    id: 'moneySaver',
    title: 'Money Saver',
    description: 'Save over $50',
    emoji: '💰',
    condition: (puffData, dailyGoal, costPerUnit) => {
      const totalSaved = calculateTotalSavings(puffData, dailyGoal, costPerUnit);
      return totalSaved >= 50;
    }
  }
};

// Helper function to get count from data (handles both old and new formats)
function getCountFromData(data) {
  if (!data) return 0;
  if (typeof data === 'number') return data;
  if (Array.isArray(data)) return data.length;
  return 0;
}

// Helper function to check streak
function checkStreak(puffData, dailyGoal, streakLength) {
  const dates = [];
  const today = new Date();
  
  // Generate last N days including today
  for (let i = 0; i < streakLength; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.unshift(date.toISOString().split('T')[0]);
  }
  
  // Check if all days in the streak meet the goal
  return dates.every(date => {
    const count = getCountFromData(puffData[date]);
    return count > 0 && count <= dailyGoal;
  });
}

// Helper function to calculate total savings
function calculateTotalSavings(puffData, dailyGoal, costPerUnit) {
  let totalSaved = 0;
  
  Object.entries(puffData).forEach(([date, data]) => {
    const count = getCountFromData(data);
    if (count <= dailyGoal) {
      const saved = Math.max(0, dailyGoal - count);
      totalSaved += saved * costPerUnit;
    }
  });
  
  return totalSaved;
}

// Check which achievements should be unlocked
export function checkAchievements(puffData, dailyGoal, costPerUnit, currentAchievements) {
  const newAchievements = {};
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    // Skip if already unlocked
    if (currentAchievements[achievement.id]) {
      return;
    }
    
    // Check if condition is met
    if (achievement.condition(puffData, dailyGoal, costPerUnit)) {
      newAchievements[achievement.id] = {
        ...achievement,
        unlockedAt: new Date().toISOString()
      };
    }
  });
  
  return newAchievements;
}

// Get achievement progress for display
export function getAchievementProgress(achievementId, puffData, dailyGoal, costPerUnit) {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return { current: 0, target: 1, percentage: 0 };
  
  switch (achievementId) {
    case 'firstStep':
      const hasAnyPuffs = Object.values(puffData).some(data => getCountFromData(data) > 0);
      return {
        current: hasAnyPuffs ? 1 : 0,
        target: 1,
        percentage: hasAnyPuffs ? 100 : 0
      };
      
    case 'goalCrusher':
      const today = new Date().toISOString().split('T')[0];
      const todayCount = getCountFromData(puffData[today] || 0);
      const metGoal = todayCount > 0 && todayCount <= dailyGoal;
      return {
        current: metGoal ? 1 : 0,
        target: 1,
        percentage: metGoal ? 100 : 0
      };
      
    case 'buildingHabits':
    case 'weekWarrior':
    case 'monthlyMaster':
      const targetStreak = achievementId === 'buildingHabits' ? 3 : 
                          achievementId === 'weekWarrior' ? 7 : 30;
      const currentStreak = getCurrentStreak(puffData, dailyGoal);
      return {
        current: Math.min(currentStreak, targetStreak),
        target: targetStreak,
        percentage: Math.min((currentStreak / targetStreak) * 100, 100)
      };
      
    case 'moneySaver':
      const totalSaved = calculateTotalSavings(puffData, dailyGoal, costPerUnit);
      return {
        current: Math.min(totalSaved, 50),
        target: 50,
        percentage: Math.min((totalSaved / 50) * 100, 100)
      };
      
    default:
      return { current: 0, target: 1, percentage: 0 };
  }
}

// Get current streak length
function getCurrentStreak(puffData, dailyGoal) {
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) { // Max check 1 year
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const count = getCountFromData(puffData[dateString] || 0);
    if (count > 0 && count <= dailyGoal) {
      streak++;
    } else if (count > 0) {
      // Had puffs but exceeded goal - break streak
      break;
    }
    // If no puffs recorded, continue checking (might be weekend/no data)
  }
  
  return streak;
}

// Calculate various statistics
export function calculateStats(puffData, dailyGoal, costPerUnit) {
  const dates = Object.keys(puffData).sort();
  if (dates.length === 0) {
    return {
      totalPuffs: 0,
      totalDays: 0,
      dailyAverage: 0,
      weeklyAverage: 0,
      monthlyAverage: 0,
      totalCost: 0,
      totalSaved: 0,
      currentStreak: 0,
      longestStreak: 0
    };
  }
  
  const totalPuffs = Object.values(puffData).reduce((sum, data) => sum + getCountFromData(data), 0);
  const totalDays = dates.length;
  const dailyAverage = totalPuffs / totalDays;
  
  // Weekly average (last 7 days)
  const last7Days = dates.slice(-7);
  const weeklyTotal = last7Days.reduce((sum, date) => sum + getCountFromData(puffData[date] || 0), 0);
  const weeklyAverage = last7Days.length > 0 ? weeklyTotal / last7Days.length : 0;
  
  // Monthly average (last 30 days)
  const last30Days = dates.slice(-30);
  const monthlyTotal = last30Days.reduce((sum, date) => sum + getCountFromData(puffData[date] || 0), 0);
  const monthlyAverage = last30Days.length > 0 ? monthlyTotal / last30Days.length : 0;
  
  const totalCost = totalPuffs * costPerUnit;
  const totalSaved = calculateTotalSavings(puffData, dailyGoal, costPerUnit);
  const currentStreak = getCurrentStreak(puffData, dailyGoal);
  
  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  
  dates.forEach(date => {
    const count = getCountFromData(puffData[date] || 0);
    if (count > 0 && count <= dailyGoal) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (count > 0) {
      tempStreak = 0;
    }
  });
  
  return {
    totalPuffs,
    totalDays,
    dailyAverage: Math.round(dailyAverage * 10) / 10,
    weeklyAverage: Math.round(weeklyAverage * 10) / 10,
    monthlyAverage: Math.round(monthlyAverage * 10) / 10,
    totalCost: Math.round(totalCost * 100) / 100,
    totalSaved: Math.round(totalSaved * 100) / 100,
    currentStreak,
    longestStreak
  };
} 