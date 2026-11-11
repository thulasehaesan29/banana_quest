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
    <div className="auth-card-container">
      <div className="auth-card">
        {/* Left Side: Mascot Illustration */}
        <div className="auth-visual-side">
          <div className="visual-badge">Welcome Back, Adventurer!</div>
          <Mascot variant="happy" size={170} />
          <h2 className="visual-heading">Ready for the Jungle?</h2>
          <p className="visual-text">
            Solve math riddles, collect bananas, and climb to the top of the global leaderboard!
          </p>
          <div className="visual-fun-fact">
            <span>🍌 Fun Fact:</span> Monkeys love solving equations almost as much as eating bananas!
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <div className="game-brand-pill">
              <span className="banana-spin">🍌</span> BANANA QUEST
            </div>
            <h1 className="auth-title">Player Sign In</h1>
            <p className="auth-subtitle">
              Enter your credentials to access your virtual identity & stats
            </p>
          </div>

          {(localError || authError) && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. alex@bananaquest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="primary-btn submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-dots">Logging in...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Quick Demo Login (Helpful for Tutors / Demonstrations) */}
            <div className="demo-login-divider">
              <span>OR TRY WITH ONE CLICK</span>
            </div>

            <button
              type="button"
              className="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={loading}
              title="Instantly sign in as Alex (Pre-loaded with 120 bananas and stats)"
            >
              <Zap size={16} className="zap-icon" />
              <span>Quick Login as Demo User (Alex)</span>
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="auth-footer">
            <span>Don't have a Banana Quest account?</span>
            <button
              type="button"
              className="switch-auth-btn"
              onClick={() => {
                sounds.playClick();
                onSwitchToRegister();
              }}
            >
              Create Account
            </button>
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
