import React from 'react';
import { Award, CheckCircle, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from './SoundEffects';

export default function AchievementsModal({ onClose }) {
  const { user } = useAuth();
  const unlocked = user?.achievements || ['first_banana'];

  const achievementsList = [
    {
      id: 'welcome_monkey',
      title: 'Welcome to the Jungle',
      description: 'Create an account and establish your virtual identity',
      icon: '🌴',
      points: '+20 🍌',
    },
    {
      id: 'first_banana',
      title: 'First Banana Harvest',
      description: 'Solve your first Marc Conrad Banana API equation',
      icon: '🍌',
      points: '+50 🍌',
    },
    {
      id: 'puzzle_master',
      title: 'Algebraic Monkey',
      description: 'Complete a full multi-stage medium or hard challenge',
      icon: '🧠',
      points: '+100 🍌',
    },
    {
      id: 'freeze_master',
      title: 'Sub-Zero Scholar',
      description: 'Successfully deploy the Time Freeze power-up',
      icon: '❄️',
      points: '+40 🍌',
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Submit a correct answer with >50% timer remaining',
      icon: '⚡',
      points: '+80 🍌',
    },
    {
      id: 'super_ape',
      title: 'Apex Primate',
      description: 'Reach Level 5 and collect 500 total bananas',
      icon: '👑',
      points: '+200 🍌',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Award size={24} className="trophy-gold" />
            <h2>Player Achievements</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="achievements-sub">
          Unlock badges by testing your skills, mastering equations, and climbing the ranks.
        </p>

        <div className="achievements-list">
          {achievementsList.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id) || (user?.totalBananas >= 100 && ach.id === 'first_banana');
            return (
              <div
                key={ach.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon-box">
                  <span className="achievement-emoji">{ach.icon}</span>
                </div>
                <div className="achievement-details">
                  <div className="ach-title-row">
                    <strong>{ach.title}</strong>
                    <span className="ach-points-tag">{ach.points}</span>
                  </div>
                  <p className="ach-desc">{ach.description}</p>
                </div>
                <div className="achievement-status">
                  {isUnlocked ? (
                    <CheckCircle className="status-unlocked" size={22} />
                  ) : (
                    <Lock className="status-locked" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
