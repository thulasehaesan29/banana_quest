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
    <div className="mindrush-level-select-page">
      {/* Personalized Header Hero */}
      <div className="mindrush-level-hero">
        <div className="hero-content-left">
          <div className="hero-tag-pill pulse-glow">
            <span>✨</span> MINDRUSH ARENA
          </div>
          <h1 className="hero-player-title">
            Welcome back, <span className="highlight-player">{playerName}</span>! <span className="wave-hand">👋</span>
          </h1>
          <p className="hero-player-sub">
            Select your challenge level below to solve live equations and climb the ranks!
          </p>
        </div>

        {/* Floating Quick Stats Ribbon */}
        <div className="hero-stats-ribbon">
          <div className="ribbon-stat-item">
            <span className="ribbon-icon">🍌</span>
            <div className="ribbon-text">
              <strong className="ribbon-val">{totalBananas}</strong>
              <span className="ribbon-lbl">Bananas</span>
            </div>
          </div>

          <div className="ribbon-stat-item">
            <Calendar size={20} className="ribbon-icon calendar-color" />
            <div className="ribbon-text">
              <strong className="ribbon-val">{daysPlayed}d</strong>
              <span className="ribbon-lbl">Played</span>
            </div>
          </div>

          <div className="ribbon-stat-item">
            <Trophy size={20} className="ribbon-icon trophy-color" />
            <div className="ribbon-text">
              <strong className="ribbon-val">{highScore}</strong>
              <span className="ribbon-lbl">High Score</span>
            </div>
          </div>

          <div className="ribbon-stat-item">
            <Award size={20} className="ribbon-icon rank-color" />
            <div className="ribbon-text">
              <strong className="ribbon-val">Lvl {level}</strong>
              <span className="ribbon-lbl">Player Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Level Cards Grid */}
      <div className="mindrush-tiers-section">
        <div className="tiers-header-row">
          <h2 className="tiers-title">Choose Difficulty Tier</h2>
          <span className="tiers-sub">Higher tiers have tighter time limits and award maximum points</span>
        </div>

        <div className="mindrush-tier-cards-grid">
          {/* Card 1: Easy Tier */}
          <div className="tier-card tier-easy" onClick={() => handleSelectDifficulty('easy')}>
            <div className="tier-card-glow glow-easy"></div>
            <div className="tier-top-row">
              <span className="tier-badge badge-easy">Tier 01</span>
              <span className="tier-status">Warm-up</span>
            </div>

            <div className="tier-mascot-frame">
              <Mascot variant="happy" size={130} />
            </div>

            <h3 className="tier-name">EASY</h3>
            <p className="tier-summary">Single equation challenge designed for speed and practice.</p>

            <div className="tier-specs-list">
              <div className="spec-row">
                <span className="spec-label">Puzzles</span>
                <span className="spec-val">1 Puzzle</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Reward</span>
                <span className="spec-val highlight-pts">+10 Pts</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Time Limit</span>
                <span className="spec-val">60 Seconds</span>
              </div>
            </div>

            <button className="tier-play-btn btn-easy">
              <Play size={18} fill="currentColor" />
              <span>Launch Easy</span>
            </button>
          </div>

          {/* Card 2: Medium Tier (Featured) */}
          <div className="tier-card tier-medium featured-tier" onClick={() => handleSelectDifficulty('medium')}>
            <div className="popular-ribbon">⭐ MOST POPULAR</div>
            <div className="tier-card-glow glow-medium"></div>
            <div className="tier-top-row">
              <span className="tier-badge badge-medium">Tier 02</span>
              <span className="tier-status">Logic Master</span>
            </div>

            <div className="tier-mascot-frame">
              <Mascot variant="glasses" size={130} />
            </div>

            <h3 className="tier-name">MEDIUM</h3>
            <p className="tier-summary">Multi-step equations requiring quick arithmetic and sharp focus.</p>

            <div className="tier-specs-list">
              <div className="spec-row">
                <span className="spec-label">Puzzles</span>
                <span className="spec-val">2 Puzzles</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Reward</span>
                <span className="spec-val highlight-pts">+20 Pts</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Time Limit</span>
                <span className="spec-val">45 Seconds</span>
              </div>
            </div>

            <button className="tier-play-btn btn-medium">
              <Play size={18} fill="currentColor" />
              <span>Launch Medium</span>
            </button>
          </div>

          {/* Card 3: Hard Tier */}
          <div className="tier-card tier-hard" onClick={() => handleSelectDifficulty('hard')}>
            <div className="tier-card-glow glow-hard"></div>
            <div className="tier-top-row">
              <span className="tier-badge badge-hard">Tier 03</span>
              <span className="tier-status">Lightning Fast</span>
            </div>

            <div className="tier-mascot-frame">
              <Mascot variant="super" size={130} />
            </div>

            <h3 className="tier-name">HARD</h3>
            <p className="tier-summary">Triple equation gauntlet against a relentless 30-second timer!</p>

            <div className="tier-specs-list">
              <div className="spec-row">
                <span className="spec-label">Puzzles</span>
                <span className="spec-val">3 Puzzles</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Reward</span>
                <span className="spec-val highlight-pts">+40 Pts</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Time Limit</span>
                <span className="spec-val">30 Seconds</span>
              </div>
            </div>

            <button className="tier-play-btn btn-hard">
              <Flame size={18} />
              <span>Launch Hard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
