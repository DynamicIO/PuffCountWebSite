# Puff Tracker 📱

A comprehensive web application designed to help users monitor and track their daily puff consumption with detailed analytics, goal setting, and progress visualization.

![Puff Tracker Banner](https://via.placeholder.com/800x300/667eea/ffffff?text=Puff+Tracker+📱)

## 🌟 Features

### 📊 **Daily Tracking & Analytics**
- **Real-time Puff Counter**: Easy-to-use increment/decrement buttons for logging puffs
- **Progress Circle**: Visual circular progress indicator showing daily consumption vs. goal
- **Smart Statistics Cards**: Daily, weekly, and monthly averages with comprehensive insights

### 📅 **Interactive Calendar**
- **Color-coded Calendar**: Visual calendar with consumption level indicators
- **Dynamic Color System**: 
  - 🟢 Green: At or below daily goal
  - 🟡 Yellow: Above goal but manageable
  - 🔴 Red: Well above daily goal
- **Date Selection**: Click any date to view/edit historical data
- **Historical Data Management**: Edit past entries with intuitive controls

### 🎯 **Goal Setting & Progress**
- **Customizable Daily Goal**: Set and adjust personal daily consumption targets
- **Progress Visualization**: Real-time visual indicators showing progress toward goals
- **Dynamic Thresholds**: Calendar colors automatically adjust based on your set goal
- **Cost Tracking**: Monitor daily spending and savings based on cost per unit

### 📈 **Monthly Reports**
- **Detailed Monthly View**: Comprehensive breakdown with interactive bar charts
- **Visual Analytics**: Color-coded charts showing daily consumption patterns
- **Financial Analysis**: Track costs, savings, and spending trends
- **Trend Comparison**: Month-over-month progress analysis

### 🏆 **Achievement System**
- **Progress Milestones**: Unlock achievements for various accomplishments:
  - 👶 **First Step**: Log your first puff
  - 🎯 **Goal Crusher**: Stay under daily goal
  - 🔥 **Building Habits**: 3-day streak under goal
  - ⚔️ **Week Warrior**: 7-day streak under goal
  - 👑 **Monthly Master**: 30-day streak under goal
  - 💰 **Money Saver**: Save over $50
- **Achievement Gallery**: View all unlocked achievements with dates
- **Real-time Notifications**: Celebratory popups when unlocking new achievements

### ⚙️ **Settings & Customization**
- **Goal Adjustment**: Easy increment/decrement controls for daily targets
- **Cost Configuration**: Set cost per unit for accurate financial tracking
- **Theme Toggle**: Seamless switching between light and dark modes
- **Data Management**: Reset functionality while preserving settings

### 🎨 **Modern User Interface**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Beautiful themes with smooth transitions
- **Smooth Animations**: Polished interactions with CSS transitions
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd puff-tracker-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically reload when you make changes

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📱 Usage Guide

### Getting Started
1. **Set Your Goal**: Go to Settings and adjust your daily goal
2. **Track Daily**: Use the + and - buttons on the Dashboard to log consumption
3. **Monitor Progress**: Watch your progress circle fill as you approach your goal
4. **Review Calendar**: Check the Calendar tab to see color-coded daily patterns
5. **Analyze Reports**: View detailed monthly analytics in the Reports tab
6. **Unlock Achievements**: Complete challenges to unlock motivational badges

### Best Practices
- **Daily Logging**: Log your consumption in real-time for accuracy
- **Regular Reviews**: Check weekly and monthly reports to identify patterns
- **Goal Adjustment**: Gradually reduce your daily goal over time
- **Achievement Focus**: Use achievements as motivation milestones

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables for theming
- **Charts**: Chart.js with react-chartjs-2
- **Calendar**: react-calendar
- **Icons**: Lucide React
- **Data Storage**: Local Storage (browser-based)

## 📊 Data & Privacy

### Local Storage
- **Complete Privacy**: All data remains on your device
- **No External Servers**: No registration or personal information required
- **Offline Functionality**: Full app functionality without internet connection
- **Data Control**: Export/import capabilities for data portability

### Data Structure
```javascript
{
  puffData: {
    "2024-01-15": 12,
    "2024-01-16": 8,
    // ... more dates
  },
  dailyGoal: 10,
  costPerUnit: 5.0,
  theme: "light",
  achievements: {
    "firstStep": {
      unlockedAt: "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 🎯 Use Cases

### Personal Health Monitoring
- Track daily consumption patterns to identify trends
- Set reduction goals and monitor progress over time
- Visualize consumption data to make informed decisions
- Monitor financial impact of consumption habits

### Habit Formation
- Use achievement system for motivation and accountability
- Set realistic daily goals and gradually reduce over time
- Build awareness of consumption patterns
- Create positive reinforcement through progress tracking

### Healthcare Support
- Provide accurate consumption data to healthcare providers
- Track progress during reduction programs
- Maintain detailed logs for medical consultations
- Monitor the effectiveness of interventions

## 🔧 Customization

### Themes
The app supports custom themes through CSS variables. To create a new theme:

1. **Define theme colors** in `src/index.css`:
   ```css
   [data-theme="custom"] {
     --bg-primary: #your-color;
     --text-primary: #your-color;
     /* ... more variables */
   }
   ```

2. **Update theme toggle** in the settings component

### Adding Features
The modular architecture makes it easy to add new features:
- **New tabs**: Add to the `tabs` array in `App.jsx`
- **New achievements**: Add to `ACHIEVEMENTS` in `utils/achievements.js`
- **New statistics**: Extend the `calculateStats` function

## 📈 Performance

- **Lightweight**: Minimal bundle size with optimized dependencies
- **Fast Loading**: Vite's fast build system and code splitting
- **Smooth Animations**: CSS-based animations for optimal performance
- **Efficient Rendering**: React optimization with proper state management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is available for personal use and modification. Please refer to the license file for detailed terms and conditions.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the Issues tab** for existing solutions
2. **Create a new issue** with detailed information
3. **Include screenshots** if applicable
4. **Specify your browser and OS** for compatibility issues

---

**Puff Tracker** - Empowering users to take control of their habits through comprehensive tracking, goal setting, and progress visualization. 🎯📊 