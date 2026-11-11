import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Mascot from './Mascot';
import { User, Mail, Calendar, Trophy, Award, Save, X, Check } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function ProfileModal({ onClose }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'happy-monkey');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatars = [
    { id: 'happy-monkey', label: 'Happy', emoji: '🐵', variant: 'happy' },
    { id: 'glasses-monkey', label: 'Scholar', emoji: '🤓', variant: 'glasses' },
    { id: 'super-monkey', label: 'Superhero', emoji: '🦸', variant: 'super' },
    { id: 'ninja-monkey', label: 'Ninja', emoji: '🥷', variant: 'ninja' },
    { id: 'space-monkey', label: 'Cosmo', emoji: '🚀', variant: 'space' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      sounds.playClick();
      await updateProfile({
        name: name.trim(),
        avatar: selectedAvatar,
      });
      sounds.playCorrect();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      sounds.playWrong();
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentVariant = avatars.find((a) => a.id === selectedAvatar)?.variant || 'happy';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <User size={24} className="trophy-gold" />
            <h2>Virtual Identity & Profile</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="profile-body-layout">
          {/* Avatar Preview */}
          <div className="profile-avatar-column">
            <Mascot variant={currentVariant} size={130} />
            <div className="avatar-selection-mini">
              <span>Switch Avatar:</span>
              <div className="avatar-chip-grid">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`avatar-chip ${selectedAvatar === av.id ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedAvatar(av.id);
                    }}
                    title={av.label}
                  >
                    <span>{av.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form and Stats */}
          <form onSubmit={handleSave} className="profile-form-column">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Username (Virtual Handle)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={`@${user?.username || 'player'}`}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            {/* Profile Statistics Bar */}
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="stat-label">Total Bananas</span>
                <strong className="stat-val text-yellow">{user?.totalBananas ?? 0} 🍌</strong>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">High Score</span>
                <strong className="stat-val">{user?.highScore ?? 0} pts</strong>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Games Played</span>
                <strong className="stat-val">{user?.gamesPlayed ?? 0}</strong>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Days Active</span>
                <strong className="stat-val">{user?.daysPlayed ?? 1} Days</strong>
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn save-profile-btn"
              disabled={saving}
            >
              {saving ? (
                <span>Saving...</span>
              ) : savedSuccess ? (
                <>
                  <Check size={18} />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
