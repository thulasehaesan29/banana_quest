import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import LevelSelect from './components/LevelSelect';
import GameDashboard from './components/GameDashboard';
import Leaderboard from './components/Leaderboard';
import AchievementsModal from './components/AchievementsModal';
import ProfileModal from './components/ProfileModal';
import AcademicGuideModal from './components/AcademicGuideModal';
import './App.css';

function MainAppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('level-select');
  const [gameDifficulty, setGameDifficulty] = useState('easy');
  const [isMuted, setIsMuted] = useState(false);

  // Modals state
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAcademicGuide, setShowAcademicGuide] = useState(false);

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="banana-spinner">🍌</div>
        <h2>Loading Banana Quest...</h2>
      </div>
    );
  }

  // Determine which screen to render
  const renderScreen = () => {
    // If not authenticated and not explicitly on register, show login
    if (!user) {
      if (currentScreen === 'register') {
        return (
          <RegisterForm
            onSwitchToLogin={() => setCurrentScreen('login')}
            onRegisterSuccess={() => setCurrentScreen('level-select')}
          />
        );
      }
      return (
        <LoginForm
          onSwitchToRegister={() => setCurrentScreen('register')}
          onLoginSuccess={() => setCurrentScreen('level-select')}
        />
      );
    }

    switch (currentScreen) {
      case 'level-select':
        return (
          <LevelSelect
            onStartGame={(difficulty) => {
              setGameDifficulty(difficulty);
              setCurrentScreen('game');
            }}
            onViewLeaderboard={() => setCurrentScreen('leaderboard')}
          />
        );

      case 'game':
        return (
          <GameDashboard
            difficulty={gameDifficulty}
            onFinishGame={(target) => {
              if (target === 'leaderboard') setCurrentScreen('leaderboard');
              else setCurrentScreen('level-select');
            }}
            onBackToLevels={() => setCurrentScreen('level-select')}
          />
        );

      case 'leaderboard':
        return (
          <Leaderboard
            onStartPlay={() => setCurrentScreen('level-select')}
          />
        );

      default:
        return (
          <LevelSelect
            onStartGame={(difficulty) => {
              setGameDifficulty(difficulty);
              setCurrentScreen('game');
            }}
            onViewLeaderboard={() => setCurrentScreen('leaderboard')}
          />
        );
    }
  };

  return (
    <div className="banana-quest-app">
      {/* Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        setScreen={setCurrentScreen}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenAcademicGuide={() => setShowAcademicGuide(true)}
      />

      {/* Main View Area */}
      <main className="main-content-viewport">
        {renderScreen()}
      </main>

      {/* Floating Quick Guide Button (Bottom Right) */}
      <button
        className="floating-guide-trigger"
        onClick={() => setShowAcademicGuide(true)}
        title="CIS046-3 Video Presentation Spec & 4-Themes Guide"
      >
        <span>📘 4-Themes Spec</span>
      </button>

      {/* Modals */}
      {showAchievements && (
        <AchievementsModal onClose={() => setShowAchievements(false)} />
      )}

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}

      {showAcademicGuide && (
        <AcademicGuideModal onClose={() => setShowAcademicGuide(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
