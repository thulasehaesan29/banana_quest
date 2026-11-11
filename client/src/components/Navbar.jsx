import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Award, User as UserIcon, LogOut, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function Navbar({
  currentScreen,
  setScreen,
  isMuted,
  setIsMuted,
  onOpenAchievements,
  onOpenProfile,
  onOpenAcademicGuide,
}) {
  const { user, logout } = useAuth();

  const handleSoundToggle = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sounds.setMuted(nextState);
    if (!nextState) {
      sounds.playClick();
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    logout();
    setScreen('login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Logo & Brand */}
        <div
          className="brand-logo"
          onClick={() => {
            sounds.playClick();
            if (user) setScreen('level-select');
            else setScreen('login');
          }}
        >
          <span className="brand-banana">🍌</span>
          <div className="brand-text">
            <span className="brand-title">BANANA QUEST</span>
            <span className="brand-subtitle">Software Enterprise Edition</span>
          </div>
        </div>

        {/* Center Nav Links */}
        {user && (
          <nav className="nav-links">
            <button
              className={`nav-btn ${currentScreen === 'level-select' || currentScreen === 'game' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setScreen('level-select');
              }}
            >
              🎮 Play
            </button>
            <button
              className={`nav-btn ${currentScreen === 'leaderboard' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setScreen('leaderboard');
              }}
            >
              <Trophy size={16} /> Leaderboard
            </button>
            <button
              className="nav-btn"
              onClick={() => {
                sounds.playClick();
                onOpenAchievements();
              }}
            >
              <Award size={16} /> Achievements
            </button>
            <button
              className="nav-btn academic-pill"
              onClick={() => {
                sounds.playClick();
                onOpenAcademicGuide();
              }}
              title="View CIS046-3 4-Theme Video Presentation Guide"
            >
              <BookOpen size={16} /> 4-Themes Guide
            </button>
          </nav>
        )}

        {/* Right Actions & Virtual Identity Profile */}
        <div className="nav-actions">
          {/* Audio Toggle */}
          <button
            className="icon-btn audio-btn"
            onClick={handleSoundToggle}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {user ? (
            <div className="user-profile-badge">
              <div
                className="user-pill"
                onClick={() => {
                  sounds.playClick();
                  onOpenProfile();
                }}
                title="View & Edit Profile"
              >
                <div className="banana-counter">
                  <span>🍌</span>
                  <strong>{user.totalBananas ?? 0}</strong>
                </div>
                <div className="user-avatar-tiny">
                  {user.avatar === 'glasses-monkey' ? '🤓' :
                   user.avatar === 'super-monkey' ? '🦸' :
                   user.avatar === 'ninja-monkey' ? '🥷' :
                   user.avatar === 'space-monkey' ? '🚀' : '🐵'}
                </div>
                <span className="username-label">{user.username}</span>
              </div>

              <button
                className="icon-btn logout-btn"
                onClick={handleLogout}
                title="Logout of Virtual Identity"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              className="nav-login-btn"
              onClick={() => {
                sounds.playClick();
                setScreen('login');
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
