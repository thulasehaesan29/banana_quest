import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Trophy, Award, User, LogOut, Volume2, VolumeX } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function Navbar({
  currentScreen,
  setScreen,
  isMuted,
  setIsMuted,
  onOpenAchievements,
  onOpenProfile,
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
          </div>
        </div>

        {/* Center Nav Links: Home, Leaderboard, Achievements, Profile */}
        {user && (
          <nav className="nav-links">
            <button
              className={`nav-btn ${currentScreen === 'level-select' || currentScreen === 'game' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setScreen('level-select');
              }}
            >
              <Home size={16} /> Home
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
              className="nav-btn"
              onClick={() => {
                sounds.playClick();
                onOpenProfile();
              }}
            >
              <User size={16} /> Profile
            </button>
          </nav>
        )}

        {/* Right Actions & Profile */}
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
                title="Logout"
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
