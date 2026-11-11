import React from 'react';
import { useAuth } from '../context/AuthContext';
import Mascot from './Mascot';
import { Trophy, Calendar, Sparkles, Clock, Play, Flame, Award } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function LevelSelect({ onStartGame, onViewLeaderboard }) {
  const { user } = useAuth();

  const handleSelectDifficulty = (difficulty) => {
    sounds.playClick();
    onStartGame(difficulty);
  };

  const playerName = user?.name ? user.name.split(' ')[0] : 'Alex';
  const totalBananas = user?.totalBananas ?? 120;
  const daysPlayed = user?.daysPlayed ?? 3;
  const highScore = user?.highScore ?? 240;
  const level = user?.level ?? 4;

  return (
    <div className="level-select-container">
      {/* Personalized Header Banner */}
      <div className="level-header-banner">
        <div className="greeting-text-block">
          <div className="welcome-tag">
            <span className="sparkle-icon">✨</span> Welcome to Banana Quest
          </div>
          <h1 className="player-greeting">
            Hello, {playerName}! <span className="wave-hand">👋</span>
          </h1>
          <p className="greeting-subtext">
            Choose your difficulty level and tackle real-time algebraic puzzles fetched from the external Banana REST API!
          </p>
        </div>

        {/* User Stats Card */}
        <div className="stats-pill-container">
          <div className="stat-pill">
            <div className="stat-icon-wrapper banana-accent">
              <span className="stat-emoji">🍌</span>
            </div>
            <div className="stat-details">
              <span className="stat-number">{totalBananas}</span>
              <span className="stat-title">Total Bananas</span>
            </div>
          </div>

          <div className="stat-pill">
            <div className="stat-icon-wrapper calendar-accent">
              <Calendar size={22} className="accent-icon" />
            </div>
            <div className="stat-details">
              <span className="stat-number">{daysPlayed} Days</span>
              <span className="stat-title">Days Played</span>
            </div>
          </div>

          <div className="stat-pill">
            <div className="stat-icon-wrapper trophy-accent">
              <Trophy size={22} className="accent-icon" />
            </div>
            <div className="stat-details">
              <span className="stat-number">{highScore} pts</span>
              <span className="stat-title">High Score</span>
            </div>
          </div>

          <div className="stat-pill">
            <div className="stat-icon-wrapper rank-accent">
              <Award size={22} className="accent-icon" />
            </div>
            <div className="stat-details">
              <span className="stat-number">Level {level}</span>
              <span className="stat-title">Player Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection Section */}
      <div className="cards-section">
        <h2 className="section-title">
          <span>Choose Your Challenge</span>
        </h2>

        <div className="difficulty-grid">
          {/* Card 1: Easy */}
          <div className="difficulty-card easy-card">
            <div className="card-badge easy-badge">Beginner</div>
            <div className="mascot-avatar-box">
              <Mascot variant="happy" size={130} />
            </div>
            <h3 className="card-title">Easy</h3>
            <p className="card-description">
              Perfect for warming up your brain. Single puzzle challenge.
            </p>
            <div className="card-specs">
              <div className="spec-item">
                <Sparkles size={16} />
                <span><strong>1 puzzle</strong></span>
              </div>
              <div className="spec-dot">•</div>
              <div className="spec-item">
                <Trophy size={16} />
                <span><strong>10 points</strong></span>
              </div>
              <div className="spec-dot">•</div>
              <div className="spec-item">
                <Clock size={16} />
                <span>60s timer</span>
              </div>
            </div>
            <button
              className="level-action-btn start-easy-btn"
              onClick={() => handleSelectDifficulty('easy')}
            >
              <Play size={18} fill="currentColor" />
              <span>Start Easy</span>
            </button>
          </div>

          {/* Card 2: Medium */}
          <div className="difficulty-card medium-card featured-card">
            <div className="card-badge medium-badge">Most Popular</div>
            <div className="mascot-avatar-box">
              <Mascot variant="glasses" size={130} />
            </div>
            <h3 className="card-title">Medium</h3>
            <p className="card-description">
              Test your logic with multi-stage equations and shorter time limits.
            </p>
            <div className="card-specs">
              <div className="spec-item">
                <Sparkles size={16} />
                <span><strong>2 puzzles</strong></span>
              </div>
              <div className="spec-dot">•</div>
              <div className="spec-item">
                <Trophy size={16} />
                <span><strong>20 points</strong></span>
              </div>
              <div className="spec-dot">•</div>
              <div className="spec-item">
                <Clock size={16} />
                <span>45s timer</span>
              </div>
            </div>
            <button
              className="level-action-btn start-medium-btn"
              onClick={() => handleSelectDifficulty('medium')}
            >
              <Play size={18} fill="currentColor" />
              <span>Start Medium</span>
            </button>
          </div>

          {/* Card 3: Hard */}
          <div className="difficulty-card hard-card">
            <div className="card-badge hard-badge">Superhero</div>
            <div className="mascot-avatar-box">
              <Mascot variant="super" size={130} />
            </div>
            <h3 className="card-title">Hard</h3>
            <p className="card-description">
              Intense 3-stage challenge for rapid-fire puzzle masters!
            </p>
            <div className="card-specs">
              <div className="spec-item">
                <Flame size={16} />
                <span><strong>3 puzzles</strong></span>
              </div>
              <div className="spec-dot">•</div>
              <div className="spec-item">
                <Trophy size={16} />
                <span><strong>40 points</strong></span>
              </div>
              <div className="spec-dot">•</div>
              <div className="spec-item">
                <Clock size={16} />
                <span>30s timer</span>
              </div>
            </div>
            <button
              className="level-action-btn start-hard-btn"
              onClick={() => handleSelectDifficulty('hard')}
            >
              <Flame size={18} />
              <span>Start Hard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
