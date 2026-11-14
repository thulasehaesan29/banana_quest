import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Mascot from './Mascot';
import { User, Mail, AtSign, Lock, CheckCircle2, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
  const { register, authError, setAuthError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
    avatar: 'happy-monkey',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const avatarOptions = [
    { id: 'happy-monkey', label: 'Happy Monkey', icon: '🐵', variant: 'happy' },
    { id: 'glasses-monkey', label: 'Scholar Monkey', icon: '🤓', variant: 'glasses' },
    { id: 'super-monkey', label: 'Super Monkey', icon: '🦸', variant: 'super' },
    { id: 'ninja-monkey', label: 'Ninja Monkey', icon: '🥷', variant: 'ninja' },
    { id: 'space-monkey', label: 'Cosmo Monkey', icon: '🚀', variant: 'space' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarSelect = (id) => {
    sounds.playClick();
    setFormData((prev) => ({ ...prev, avatar: id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    // Form Validations
    if (!formData.name.trim()) {
      setLocalError('Please enter your full name.');
      sounds.playWrong();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setLocalError('Please enter a valid email address.');
      sounds.playWrong();
      return;
    }
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      setLocalError('Username must be at least 3 characters long.');
      sounds.playWrong();
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      sounds.playWrong();
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      sounds.playWrong();
      return;
    }
    if (!formData.agreeTerms) {
      setLocalError('You must agree to the Terms & Conditions.');
      sounds.playWrong();
      return;
    }

    try {
      setLoading(true);
      sounds.playClick();
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        avatar: formData.avatar,
        agreeTerms: formData.agreeTerms,
      });
      sounds.playCorrect();
      onRegisterSuccess();
    } catch (err) {
      sounds.playWrong();
      setLocalError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentVariant = avatarOptions.find((a) => a.id === formData.avatar)?.variant || 'happy';

  return (
    <div className="auth-card-container">
      <div className="auth-card register-mode">
        {/* Left Side: Mascot & Virtual Identity Preview */}
        <div className="auth-visual-side">
          <div className="visual-badge">Virtual Identity Creator</div>
          <Mascot variant={currentVariant} size={150} />
          <h2 className="visual-heading">Join the Quest!</h2>
          <p className="visual-text">
            Establish your identity in the Jungle Enterprise network. Your score, bananas, and level
            will be securely linked to your account.
          </p>

          <div className="avatar-picker-section">
            <span className="picker-title">Select Your Monkey Avatar:</span>
            <div className="avatar-options-grid">
              {avatarOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`avatar-choice-btn ${formData.avatar === opt.id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(opt.id)}
                  title={opt.label}
                >
                  <span className="avatar-emoji">{opt.icon}</span>
                  <span className="avatar-name">{opt.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <div className="game-brand-pill">
              <span className="banana-spin">🧠</span> MINDRUSH
            </div>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-subtitle">
              Join thousands of players solving banana equations worldwide
            </p>
          </div>

          {(localError || authError) && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email & Username in 2 columns */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="alex@bananaquest.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <AtSign className="input-icon" size={18} />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="alex_pro"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="terms-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  I agree to the <strong className="terms-highlight">Terms & Conditions</strong> and Banana Fair Play Guidelines.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="primary-btn submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-dots">Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="auth-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="switch-auth-btn"
              onClick={() => {
                sounds.playClick();
                onSwitchToLogin();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
