import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Mascot from './Mascot';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { sounds } from './SoundEffects';

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
  const { login, demoLogin, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    // Validation
    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      sounds.playWrong();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address (e.g. alex@bananaquest.com).');
      sounds.playWrong();
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      sounds.playWrong();
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      sounds.playWrong();
      return;
    }

    try {
      setLoading(true);
      sounds.playClick();
      await login(email.trim(), password);
      sounds.playCorrect();
      onLoginSuccess();
    } catch (err) {
      sounds.playWrong();
      setLocalError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      sounds.playClick();
      await demoLogin();
      sounds.playCorrect();
      onLoginSuccess();
    } catch (err) {
      sounds.playWrong();
      setLocalError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mindrush-login-viewport">
      <div className="mindrush-login-container">
        {/* Top Hero Welcome Bar */}
        <div className="login-hero-header">
          <div className="mindrush-hero-badge pulse-glow">
            <span className="hero-badge-icon">🧠</span>
            <span className="hero-badge-text">MINDRUSH ARENA</span>
          </div>
          <h1 className="login-hero-title">Step into the Math Challenge</h1>
          <p className="login-hero-subtitle">
            Sign in to unlock real-time algebraic puzzles, earn speed bonuses, and climb the leaderboard!
          </p>
        </div>

        {/* The Main 2-Column Floating Card */}
        <div className="mindrush-login-card">
          {/* Left Hero Card with Mascot & Interactive Perks */}
          <div className="login-card-left">
            <div className="left-mascot-wrapper float-anim">
              <Mascot variant="happy" size={160} />
            </div>
            <h3 className="left-hero-greeting">Ready to test your speed?</h3>
            <p className="left-hero-desc">
              Fast answers earn bonus points! Protect your lives and climb the ranks.
            </p>

            <div className="perks-list">
              <div className="perk-pill">
                <span className="perk-icon">⚡</span>
                <span>Speed bonuses on fast answers</span>
              </div>
              <div className="perk-pill">
                <span className="perk-icon">❄️</span>
                <span>Time Freeze &amp; AI Clue power-ups</span>
              </div>
              <div className="perk-pill">
                <span className="perk-icon">🏆</span>
                <span>Live competitive ranking tier</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="login-card-right">
            <div className="form-heading-row">
              <h2 className="login-box-title">Player Sign In</h2>
              <span className="login-box-tag">Secure JWT</span>
            </div>

            {/* Error alerts */}
            {(localError || authError) && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{localError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mindrush-auth-form">
              <div className="form-group">
                <label htmlFor="email">Player Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    type="email"
                    placeholder="alex@bananaquest.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-link">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      sounds.playClick();
                      setForgotModal(true);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="primary-btn submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter MindRush</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="demo-login-divider">
                <span>OR INSTANT ACCESS</span>
              </div>

              <button
                type="button"
                className="secondary-btn demo-btn"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                <Zap size={16} className="zap-icon" />
                <span>Instant Play as Demo User (Alex)</span>
              </button>

              <div className="auth-footer">
                <span>Don't have a MindRush account?</span>
                <button
                  type="button"
                  className="switch-auth-btn"
                  onClick={() => {
                    sounds.playClick();
                    onSwitchToRegister();
                  }}
                >
                  Create an Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Helper */}
      {forgotModal && (
        <div className="modal-overlay" onClick={() => setForgotModal(false)}>
          <div className="modal-content forgot-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🔑 Reset Password</h3>
            <p>
              In this university demonstration version, default accounts use the password:
            </p>
            <div className="demo-credentials-box">
              <p><strong>Demo User:</strong> alex@bananaquest.com</p>
              <p><strong>Password:</strong> banana123</p>
            </div>
            <p className="text-muted">
              You can also create a brand new virtual identity using the Register screen!
            </p>
            <button
              className="primary-btn"
              onClick={() => setForgotModal(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
