import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { gameApi } from '../services/api';
import { sounds } from './SoundEffects';
import {
  Trophy,
  Heart,
  BarChart2,
  Clock,
  Zap,
  Snowflake,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  AlertTriangle,
  ZoomIn,
  ShieldCheck,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function GameDashboard({
  difficulty = 'easy',
  onFinishGame,
  onBackToLevels,
}) {
  // Session & Game State
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionUrl, setQuestionUrl] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(1);
  const [totalPuzzles, setTotalPuzzles] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [maxTime, setMaxTime] = useState(60);
  const [answerInput, setAnswerInput] = useState('');
  const [activityLog, setActivityLog] = useState([]);

  // Power-ups state
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [freezeActive, setFreezeActive] = useState(false);
  const [freezeAvailable, setFreezeAvailable] = useState(true);
  const [freezeSecondsLeft, setFreezeSecondsLeft] = useState(0);

  // Modals & Feedback
  const [feedbackMessage, setFeedbackMessage] = useState(null); // { type: 'success' | 'error', text }
  const [gameOverModal, setGameOverModal] = useState(false);
  const [victoryModal, setVictoryModal] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  const timerRef = useRef(null);

  // Helper to add activity log entry
  const logEvent = (text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLog((prev) => [{ id: Math.random(), time, text }, ...prev.slice(0, 7)]);
  };

  // 1. Initialize Game Session on Mount
  useEffect(() => {
    startNewGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  const startNewGame = async () => {
    setLoading(true);
    setGameOverModal(false);
    setVictoryModal(false);
    setAnswerInput('');
    setAiHint('');
    setFreezeActive(false);
    setFreezeAvailable(true);
    setFeedbackMessage(null);

    try {
      logEvent(`Initializing ${difficulty.toUpperCase()} game session...`);
      const data = await gameApi.startGame(difficulty);

      setSessionId(data.sessionId);
      setQuestionUrl(data.questionUrl);
      setTotalPuzzles(data.totalPuzzles);
      setCurrentPuzzleIndex(data.currentPuzzleIndex);
      setLives(data.lives);
      setScore(data.score);
      setTimeRemaining(data.timeLimit);
      setMaxTime(data.timeLimit);

      logEvent(`Puzzle 1 of ${data.totalPuzzles} loaded via Banana API REST gateway.`);
    } catch (err) {
      logEvent(`Error starting game: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Countdown Timer Event Loop
  useEffect(() => {
    if (loading || gameOverModal || victoryModal || !sessionId) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      // If time freeze is active, decrement freeze timer and do not deduct game time
      if (freezeActive) {
        setFreezeSecondsLeft((prev) => {
          if (prev <= 1) {
            setFreezeActive(false);
            logEvent('❄️ Time freeze thawed! Standard timer resumed.');
            return 0;
          }
          return prev - 1;
        });
        return;
      }

      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer reached zero -> deduct 1 life
          handleTimeExpired();
          return maxTime; // Reset timer so the game countdown continues with 1 less life
        }

        // Warning tick sound when timer <= 10
        if (prev <= 10) {
          sounds.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, gameOverModal, victoryModal, sessionId, freezeActive, maxTime]);

  const handleTimeExpired = async () => {
    sounds.playWrong();
    logEvent('⏱️ Time expired! 1 life deducted.');

    try {
      if (sessionId) {
        const timeoutRes = await gameApi.handleTimeout(sessionId);
        if (timeoutRes.status === 'GAME_OVER' || timeoutRes.livesRemaining <= 0) {
          setLives(0);
          setGameOverModal(true);
          logEvent('💀 Game Over: Out of lives!');
          return;
        } else {
          setLives(timeoutRes.livesRemaining);
          setFeedbackMessage({
            type: 'error',
            text: `Time's up! You lost 1 life. ${timeoutRes.livesRemaining} hearts remaining.`,
          });
          return;
        }
      }
    } catch {
      // Local fallback in case of network interruption
    }

    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setGameOverModal(true);
        logEvent('💀 Game Over: Out of time and lives.');
      } else {
        setFeedbackMessage({
          type: 'error',
          text: `Time's up! You lost 1 life. ${nextLives} hearts remaining.`,
        });
      }
      return Math.max(0, nextLives);
    });
  };

  // 3. Physical Keyboard Event Listener (0-9, Backspace, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || submitting || gameOverModal || victoryModal) return;

      // Allow typing in text field without overriding
      if (e.target && e.target.tagName === 'INPUT') return;

      if (e.key >= '0' && e.key <= '9') {
        sounds.playClick();
        setAnswerInput(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        sounds.playClick();
        setAnswerInput('');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerInput, submitting, loading, gameOverModal, victoryModal, sessionId]);

  // 4. Submit Answer Event Handler
  const handleSubmitAnswer = async (valueToSubmit) => {
    const ans = valueToSubmit !== undefined ? valueToSubmit : answerInput;
    if (ans === '' || ans === undefined) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a digit (0-9) before submitting.' });
      sounds.playWrong();
      return;
    }

    try {
      setSubmitting(true);
      sounds.playClick();
      setFeedbackMessage(null);

      const result = await gameApi.submitAnswer(sessionId, ans, timeRemaining);

      if (result.correct) {
        sounds.playCorrect();
        setScore(result.totalScore);

        if (result.status === 'VICTORY') {
          // Trigger confetti shower!
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
          sounds.playVictory();
          setVictoryModal(true);
          logEvent(`🏆 Victory! Completed ${difficulty} level with score ${result.totalScore}!`);
        } else if (result.status === 'NEXT_PUZZLE') {
          setQuestionUrl(result.questionUrl);
          setCurrentPuzzleIndex(result.currentPuzzleIndex);
          setAnswerInput('');
          setAiHint('');
          setTimeRemaining(maxTime);
          setFeedbackMessage({
            type: 'success',
            text: `✨ Correct! +${result.pointsEarned} points. Next puzzle unlocked!`,
          });
          logEvent(`✅ Solved puzzle. Advance to #${result.currentPuzzleIndex}/${result.totalPuzzles}.`);
        }
      } else {
        sounds.playWrong();
        setLives(result.livesRemaining);

        if (result.status === 'GAME_OVER') {
          setGameOverModal(true);
          logEvent(`❌ Game Over. Correct solution was: ${result.correctSolution}`);
        } else {
          setFeedbackMessage({
            type: 'error',
            text: `❌ Incorrect! -1 Life. ${result.livesRemaining} hearts left.`,
          });
          setAnswerInput('');
          logEvent(`⚠️ Incorrect answer (${ans}). ${result.livesRemaining} lives left.`);
        }
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Power-up: Toggle AI Clue
  const handleToggleAi = async () => {
    sounds.playClick();
    const nextState = !aiEnabled;
    setAiEnabled(nextState);

    if (nextState && !aiHint) {
      setAiLoading(true);
      logEvent('🤖 Querying AI equation analyzer...');
      try {
        const res = await gameApi.getAiHint(sessionId);
        setAiHint(res.hint);
        logEvent('💡 AI Analysis received.');
      } catch (err) {
        logEvent('Could not retrieve AI hint.');
      } finally {
        setAiLoading(false);
      }
    }
  };

  // 6. Power-up: Time Freeze
  const handleTimeFreeze = async () => {
    if (!freezeAvailable || freezeActive) return;
    sounds.playFreeze();

    try {
      const res = await gameApi.useTimeFreeze(sessionId);
      setFreezeActive(true);
      setFreezeAvailable(false);
      setFreezeSecondsLeft(res.freezeSeconds || 10);
      logEvent('❄️ Time Freeze activated for 10 seconds!');
    } catch (err) {
      logEvent('Time freeze failed to activate.');
    }
  };

  // Format Timer mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const timerPercent = (timeRemaining / maxTime) * 100;
  const isTimeUrgent = timeRemaining <= 10;

  return (
    <div className="game-dashboard-layout">
      {/* LEFT SIDEBAR: STATS */}
      <aside className="game-sidebar left-stats-sidebar">
        <div className="sidebar-section-header">
          <BarChart2 size={18} />
          <span>Game Stats</span>
        </div>

        {/* Score Card */}
        <div className="stat-card score-card">
          <div className="stat-card-top">
            <Trophy className="stat-card-icon trophy-color" size={24} />
            <span className="stat-card-title">Score</span>
          </div>
          <div className="stat-card-value">{score}</div>
          <span className="stat-card-sub">Points Earned</span>
        </div>

        {/* Lives Card */}
        <div className="stat-card lives-card">
          <div className="stat-card-top">
            <Heart className="stat-card-icon heart-color" size={24} fill="currentColor" />
            <span className="stat-card-title">Lives</span>
          </div>
          <div className="hearts-display">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                size={26}
                className={`game-heart ${heartIndex <= lives ? 'heart-full' : 'heart-empty'}`}
                fill={heartIndex <= lives ? '#EF4444' : '#E2E8F0'}
              />
            ))}
          </div>
          <span className="stat-card-sub">{lives} attempts left</span>
        </div>

        {/* Level / Progress Card */}
        <div className="stat-card level-card">
          <div className="stat-card-top">
            <Award className="stat-card-icon level-color" size={24} />
            <span className="stat-card-title">Level</span>
          </div>
          <div className="stat-card-value capitalize">{difficulty}</div>
          <div className="progress-dots">
            {Array.from({ length: totalPuzzles }).map((_, idx) => (
              <div
                key={idx}
                className={`dot ${
                  idx + 1 < currentPuzzleIndex
                    ? 'completed'
                    : idx + 1 === currentPuzzleIndex
                    ? 'current'
                    : 'pending'
                }`}
              />
            ))}
          </div>
          <span className="stat-card-sub">
            Puzzle {currentPuzzleIndex} of {totalPuzzles}
          </span>
        </div>

        {/* Timer Card */}
        <div className={`stat-card timer-card ${isTimeUrgent ? 'timer-urgent' : ''} ${freezeActive ? 'timer-frozen' : ''}`}>
          <div className="stat-card-top">
            {freezeActive ? (
              <Snowflake className="stat-card-icon freeze-color spin-slow" size={24} />
            ) : (
              <Clock className="stat-card-icon clock-color" size={24} />
            )}
            <span className="stat-card-title">{freezeActive ? 'Frozen!' : 'Timer'}</span>
          </div>
          <div className="stat-card-value timer-display">
            {formatTime(timeRemaining)}
          </div>
          <div className="timer-progress-track">
            <div
              className={`timer-progress-bar ${isTimeUrgent ? 'urgent' : ''}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <span className="stat-card-sub">
            {freezeActive ? `Freeze active: ${freezeSecondsLeft}s left` : isTimeUrgent ? 'Hurry up!' : 'Time Remaining'}
          </span>
        </div>
      </aside>

      {/* CENTER AREA: THE PUZZLE ARENA */}
      <main className="game-center-arena">
        <div className="puzzle-header-bar">
          <div className="puzzle-title-block">
            <h1 className="puzzle-title">🍌 Banana Puzzle Challenge</h1>
            <p className="puzzle-instructions">
              Look at the puzzle below and enter your answer.
            </p>
          </div>
        </div>

        {/* Feedback Message Toast */}
        {feedbackMessage && (
          <div className={`feedback-toast ${feedbackMessage.type}`}>
            {feedbackMessage.text}
          </div>
        )}

        {/* Puzzle Card Container */}
        <div className="puzzle-card">
          {loading ? (
            <div className="puzzle-loading-skeleton">
              <div className="spinner"></div>
              <span>Fetching live puzzle from Banana API...</span>
            </div>
          ) : (
            <div className="puzzle-image-wrapper">
              <img
                src={questionUrl}
                alt="Banana Math Puzzle"
                className="puzzle-image"
                onClick={() => setZoomImage(true)}
                title="Click to Enlarge Puzzle"
              />
              <button
                className="zoom-btn"
                onClick={() => setZoomImage(true)}
                title="Zoom in on puzzle"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Input & Keypad Controls */}
        <div className="game-controls-container">
          <form
            className="answer-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitAnswer();
            }}
          >
            <div className="text-input-wrapper">
              <span className="input-prefix-icon">🍌</span>
              <input
                type="text"
                className="answer-text-input"
                placeholder="Enter your answer (0-9)"
                value={answerInput}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                  setAnswerInput(cleaned);
                }}
                disabled={submitting || loading}
                autoFocus
              />
              {answerInput && (
                <button
                  type="button"
                  className="input-clear-btn"
                  onClick={() => setAnswerInput('')}
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="primary-btn submit-answer-btn"
              disabled={submitting || loading || answerInput === ''}
            >
              {submitting ? (
                <span>Validating...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </form>

          {/* Interactive On-Screen Number Pad (0-9 + Backspace) */}
          <div className="numpad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className={`numpad-key ${answerInput === String(num) ? 'selected' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setAnswerInput(String(num));
                }}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="numpad-key clear-key"
              onClick={() => {
                sounds.playClick();
                setAnswerInput('');
              }}
              title="Clear entry"
            >
              ⌫ Clear
            </button>
            <button
              type="button"
              className={`numpad-key ${answerInput === '0' ? 'selected' : ''}`}
              onClick={() => {
                sounds.playClick();
                setAnswerInput('0');
              }}
            >
              0
            </button>
            <button
              type="button"
              className="numpad-key action-key"
              onClick={() => {
                if (answerInput !== '') handleSubmitAnswer();
              }}
              title="Quick Submit"
            >
              Enter ↵
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR: TOOLS, POWER-UPS & AUDIT LOG */}
      <aside className="game-sidebar right-tools-sidebar">
        {/* Active Bonuses */}
        <div className="sidebar-tool-card bonus-card">
          <div className="tool-card-header">
            <Zap size={18} className="zap-color" />
            <span>Active Bonuses</span>
          </div>
          <div className="bonus-pill">
            <span className="bonus-tag">80% DISCOUNT</span>
            <span className="bonus-desc">Streak bonus protects against time deduction!</span>
          </div>
        </div>

        {/* Power-ups Section */}
        <div className="sidebar-tool-card powerups-card">
          <div className="tool-card-header">
            <Sparkles size={18} className="sparkle-color" />
            <span>Power-ups</span>
          </div>

          {/* AI Enhance Toggle */}
          <div className="powerup-item">
            <div className="powerup-info">
              <div className="powerup-title-row">
                <Bot size={16} />
                <strong>Optional Enhance AI</strong>
              </div>
              <span className="powerup-sub">AI equation solver clue</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={handleToggleAi}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* AI Hint Card Display */}
          {aiEnabled && (
            <div className="ai-hint-box">
              {aiLoading ? (
                <div className="ai-loading">Analyzing equation structure...</div>
              ) : (
                <div className="ai-hint-text">{aiHint}</div>
              )}
            </div>
          )}

          {/* Time Freeze Button */}
          <div className="powerup-item">
            <div className="powerup-info">
              <div className="powerup-title-row">
                <Snowflake size={16} />
                <strong>Time Freeze</strong>
              </div>
              <span className="powerup-sub">+10s ice pause</span>
            </div>
            <button
              className={`freeze-action-btn ${freezeActive ? 'active' : ''}`}
              onClick={handleTimeFreeze}
              disabled={!freezeAvailable || freezeActive}
              title={freezeAvailable ? 'Freeze timer for 10s' : 'Already used this round'}
            >
              {freezeActive ? 'Frozen' : freezeAvailable ? 'Use ❄️' : 'Used'}
            </button>
          </div>
        </div>

        {/* Live Activity & Event Log (Satisfies Event-Driven Requirement) */}
        <div className="sidebar-tool-card activity-card">
          <div className="tool-card-header">
            <Info size={16} />
            <span>Recent Activity Log</span>
          </div>
          <div className="activity-feed">
            {activityLog.map((item) => (
              <div key={item.id} className="activity-item">
                <span className="activity-time">{item.time}</span>
                <span className="activity-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MODAL: IMAGE ZOOM */}
      {zoomImage && (
        <div className="modal-overlay" onClick={() => setZoomImage(false)}>
          <div className="modal-content zoom-modal" onClick={(e) => e.stopPropagation()}>
            <img src={questionUrl} alt="Zoomed Puzzle" className="zoomed-puzzle-img" />
            <button className="primary-btn close-zoom-btn" onClick={() => setZoomImage(false)}>
              Close Zoom
            </button>
          </div>
        </div>
      )}

      {/* MODAL: VICTORY CELEBRATION */}
      {victoryModal && (
        <div className="modal-overlay">
          <div className="modal-content celebration-modal">
            <div className="celebration-badge">🏆 VICTORY!</div>
            <div className="celebration-mascot">🍌🐵🎉</div>
            <h2 className="celebration-title">Jungle Master!</h2>
            <p className="celebration-subtitle">
              You completed all puzzles in the <strong>{difficulty.toUpperCase()}</strong> tier!
            </p>

            <div className="victory-stats-summary">
              <div className="victory-stat-item">
                <span className="stat-label">Final Score</span>
                <strong className="stat-num">{score} pts</strong>
              </div>
              <div className="victory-stat-item">
                <span className="stat-label">Bananas Won</span>
                <strong className="stat-num banana-text">+{score} 🍌</strong>
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="secondary-btn"
                onClick={() => {
                  sounds.playClick();
                  onFinishGame('leaderboard');
                }}
              >
                View Leaderboard
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  sounds.playClick();
                  onBackToLevels();
                }}
              >
                Play Another Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GAME OVER */}
      {gameOverModal && (
        <div className="modal-overlay">
          <div className="modal-content game-over-modal">
            <div className="game-over-icon">💀</div>
            <h2 className="game-over-title">Game Over!</h2>
            <p className="game-over-subtitle">
              You ran out of lives or time on the banana equation challenge.
            </p>

            <div className="game-over-stats">
              <span>Points Earned: <strong>{score} pts</strong></span>
            </div>

            <div className="modal-actions-row">
              <button
                className="secondary-btn"
                onClick={() => {
                  sounds.playClick();
                  onBackToLevels();
                }}
              >
                Back to Levels
              </button>
              <button
                className="primary-btn retry-btn"
                onClick={() => {
                  sounds.playClick();
                  startNewGame();
                }}
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
