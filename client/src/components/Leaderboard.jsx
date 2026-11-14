import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaderboardApi } from '../services/api';
import { Trophy, Medal, Award, Flame, Play, RefreshCw, ArrowUp, Star } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function Leaderboard({ onStartPlay }) {
  const { user } = useAuth();
  const [period, setPeriod] = useState('all-time'); // 'daily' | 'weekly' | 'all-time'
  const [rankings, setRankings] = useState([]);
  const [myPosition, setMyPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period]);

  const fetchLeaderboard = async (selectedPeriod) => {
    setLoading(true);
    try {
      const data = await leaderboardApi.getLeaderboard(selectedPeriod);
      setRankings(data.rankings || []);
      setMyPosition(data.myPosition || null);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="rank-badge gold-badge">🥇 1st</span>;
    if (rank === 2) return <span className="rank-badge silver-badge">🥈 2nd</span>;
    if (rank === 3) return <span className="rank-badge bronze-badge">🥉 3rd</span>;
    return <span className="rank-badge default-badge">#{rank}</span>;
  };

  const getAvatarEmoji = (avatar) => {
    switch (avatar) {
      case 'glasses-monkey': return '🤓';
      case 'super-monkey': return '🦸';
      case 'ninja-monkey': return '🥷';
      case 'space-monkey': return '🚀';
      default: return '🐵';
    }
  };

  return (
    <div className="leaderboard-layout">
      {/* LEFT / CENTER: LEADERBOARD TABLE */}
      <div className="leaderboard-main">
        <div className="leaderboard-header">
          <div className="title-row">
            <Trophy size={32} className="trophy-gold" />
            <div>
              <h1 className="leaderboard-title">MindRush Leaderboard</h1>
              <p className="leaderboard-sub">
                Top players ranked by total points across enterprise puzzle sessions
              </p>
            </div>
          </div>

          {/* Time Tabs */}
          <div className="period-tabs">
            <button
              className={`tab-btn ${period === 'daily' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setPeriod('daily');
              }}
            >
              Daily
            </button>
            <button
              className={`tab-btn ${period === 'weekly' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setPeriod('weekly');
              }}
            >
              Weekly
            </button>
            <button
              className={`tab-btn ${period === 'all-time' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                setPeriod('all-time');
              }}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="leaderboard-card">
          {loading ? (
            <div className="leaderboard-loading">
              <RefreshCw className="spin-icon" size={24} />
              <span>Fetching competitive rankings...</span>
            </div>
          ) : rankings.length === 0 ? (
            <div className="empty-leaderboard">
              <span>No scores recorded for this time period yet. Be the first to play!</span>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Level</th>
                    <th>Difficulty</th>
                    <th className="text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((entry) => {
                    const isCurrentUser = user && user.username === entry.username;
                    return (
                      <tr
                        key={entry.id || entry.rank}
                        className={`table-row ${isCurrentUser ? 'current-user-row' : ''}`}
                      >
                        <td className="rank-col">
                          {getRankBadge(entry.rank)}
                        </td>
                        <td className="player-col">
                          <div className="player-info-cell">
                            <span className="player-avatar-icon">
                              {getAvatarEmoji(entry.avatar)}
                            </span>
                            <div className="player-name-wrapper">
                              <span className="player-username">
                                {entry.username}
                                {isCurrentUser && <span className="you-tag">YOU</span>}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="level-col">
                          <span className="level-badge">Lvl {entry.level || 1}</span>
                        </td>
                        <td className="diff-col capitalize">
                          {entry.difficulty || 'Normal'}
                        </td>
                        <td className="points-col text-right">
                          <strong>{entry.points}</strong> pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: PERSONAL STATS */}
      <aside className="leaderboard-sidebar">
        <div className="personal-stats-card">
          <div className="sidebar-heading">
            <Medal size={20} className="sidebar-icon" />
            <span>My Position</span>
          </div>

          <div className="personal-avatar-center">
            <div className="avatar-circle">
              {getAvatarEmoji(user?.avatar)}
            </div>
            <h3 className="personal-username">{user?.username || 'Guest Player'}</h3>
            <span className="personal-rank-pill">
              Rank: #{myPosition?.rank || 'Unranked'}
            </span>
          </div>

          <div className="personal-stats-list">
            <div className="personal-stat-row">
              <span className="p-label">Total Score:</span>
              <strong className="p-val">{myPosition?.points ?? user?.highScore ?? 0} pts</strong>
            </div>
            <div className="personal-stat-row">
              <span className="p-label">Current Level:</span>
              <strong className="p-val">Level {myPosition?.level ?? user?.level ?? 1}</strong>
            </div>
            <div className="personal-stat-row">
              <span className="p-label">Total Bananas:</span>
              <strong className="p-val text-yellow">{user?.totalBananas ?? 0} 🍌</strong>
            </div>
          </div>

          {/* Motivational text */}
          <div className="motivation-box">
            <Flame size={20} className="flame-icon" />
            <p className="motivation-text">Keep playing to climb higher! 🍌🚀</p>
          </div>

          <button
            className="primary-btn play-again-btn"
            onClick={() => {
              sounds.playClick();
              onStartPlay();
            }}
          >
            <Play size={18} fill="currentColor" />
            <span>Play A Challenge</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
