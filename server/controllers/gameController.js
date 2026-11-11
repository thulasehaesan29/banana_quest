/**
 * Game Engine & Interoperability Controller
 * 
 * Manages active game sessions, communicates with the Banana API,
 * validates answers server-side, manages power-ups, and computes scores.
 */

const crypto = require('crypto');
const BananaApiService = require('../services/bananaApiService');
const UserModel = require('../models/User');
const ScoreModel = require('../models/Score');

// In-memory active game sessions
// Structure: sessionId -> { userId, difficulty, totalPuzzles, currentPuzzleIndex, lives, score, timeLimit, currentSolution, questionUrl, startTime, usedFreeze, aiHintUsed }
const activeSessions = new Map();

// Difficulty configurations per Game Design Document
const DIFFICULTY_CONFIG = {
  easy: {
    totalPuzzles: 1,
    basePoints: 10,
    timeLimit: 60, // 60 seconds
    bonusMultiplier: 1
  },
  medium: {
    totalPuzzles: 2,
    basePoints: 20,
    timeLimit: 45, // 45 seconds
    bonusMultiplier: 1.5
  },
  hard: {
    totalPuzzles: 3,
    basePoints: 40,
    timeLimit: 30, // 30 seconds
    bonusMultiplier: 2
  }
};

/**
 * Clean up old sessions (> 1 hour old) to prevent memory leaks
 */
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, session] of activeSessions.entries()) {
    if (session.startTime < oneHourAgo) {
      activeSessions.delete(id);
    }
  }
}, 15 * 60 * 1000);

exports.startGame = async (req, res) => {
  try {
    const { difficulty = 'easy' } = req.body;
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;

    // Interoperability call: fetch first puzzle from Marc Conrad's Banana API
    const puzzle = await BananaApiService.fetchNewPuzzle();

    const sessionId = 'session_' + crypto.randomUUID();
    const sessionData = {
      id: sessionId,
      userId: req.user ? req.user.id : 'guest',
      username: req.user ? req.user.username : 'Guest Monkey',
      avatar: req.user ? req.user.avatar : 'happy-monkey',
      difficulty,
      totalPuzzles: config.totalPuzzles,
      currentPuzzleIndex: 1,
      lives: 3,
      score: 0,
      timeLimit: config.timeLimit,
      currentSolution: puzzle.solution,
      questionUrl: puzzle.question,
      startTime: Date.now(),
      usedFreeze: false,
      aiHintUsed: false
    };

    activeSessions.set(sessionId, sessionData);

    console.log(`[GameEngine] Started session ${sessionId} for user ${sessionData.username} (${difficulty}) - Hidden Solution: ${puzzle.solution}`);

    // Return game configuration WITHOUT revealing solution to client!
    return res.status(200).json({
      success: true,
      sessionId,
      difficulty,
      totalPuzzles: config.totalPuzzles,
      currentPuzzleIndex: 1,
      lives: 3,
      score: 0,
      timeLimit: config.timeLimit,
      questionUrl: puzzle.question,
      source: puzzle.source,
      message: `Game started! Solve ${config.totalPuzzles} puzzle(s) in ${config.timeLimit}s each.`
    });
  } catch (err) {
    console.error('[GameEngine] Error starting game:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to start game session.'
    });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer, timeRemaining = 0 } = req.body;

    if (!sessionId || answer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and answer are required.'
      });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Game session expired or not found. Please start a new game.'
      });
    }

    const config = DIFFICULTY_CONFIG[session.difficulty];
    const numericAnswer = parseInt(answer, 10);
    const isCorrect = numericAnswer === session.currentSolution;

    if (isCorrect) {
      // Calculate points
      // Base points + speed bonus for quick answering
      const speedBonus = Math.floor((timeRemaining / session.timeLimit) * 20);
      const pointsEarned = Math.round((config.basePoints + speedBonus) * config.bonusMultiplier);
      
      session.score += pointsEarned;
      const isLevelComplete = session.currentPuzzleIndex >= session.totalPuzzles;

      if (isLevelComplete) {
        // Entire Level Completed!
        activeSessions.delete(sessionId);

        // Update user stats if logged in
        let updatedUser = null;
        if (session.userId !== 'guest') {
          const user = await UserModel.findById(session.userId);
          if (user) {
            const newTotalBananas = (user.totalBananas || 0) + session.score;
            const newHighScore = Math.max(user.highScore || 0, session.score);
            const newGamesPlayed = (user.gamesPlayed || 0) + 1;
            const newLevel = Math.max(user.level || 1, Math.floor(newTotalBananas / 50) + 1);

            updatedUser = await UserModel.update(session.userId, {
              totalBananas: newTotalBananas,
              highScore: newHighScore,
              gamesPlayed: newGamesPlayed,
              level: newLevel
            });

            // Record into Leaderboard
            await ScoreModel.record({
              userId: session.userId,
              username: session.username,
              avatar: session.avatar,
              difficulty: session.difficulty,
              puzzlesSolved: session.totalPuzzles,
              points: session.score,
              level: newLevel
            });
          }
        }

        return res.status(200).json({
          success: true,
          status: 'VICTORY',
          correct: true,
          pointsEarned,
          totalScore: session.score,
          bananasWon: session.score,
          message: `🎉 Fantastic! You conquered the ${session.difficulty.toUpperCase()} challenge!`,
          user: updatedUser
        });
      } else {
        // Move to next puzzle in this session
        session.currentPuzzleIndex += 1;
        
        // Interoperability call: fetch next puzzle
        const nextPuzzle = await BananaApiService.fetchNewPuzzle();
        session.currentSolution = nextPuzzle.solution;
        session.questionUrl = nextPuzzle.question;
        session.aiHintUsed = false;

        console.log(`[GameEngine] Moving to puzzle ${session.currentPuzzleIndex}/${session.totalPuzzles} - Solution: ${nextPuzzle.solution}`);

        return res.status(200).json({
          success: true,
          status: 'NEXT_PUZZLE',
          correct: true,
          pointsEarned,
          totalScore: session.score,
          currentPuzzleIndex: session.currentPuzzleIndex,
          totalPuzzles: session.totalPuzzles,
          questionUrl: nextPuzzle.question,
          message: `Correct! +${pointsEarned} points. Get ready for puzzle ${session.currentPuzzleIndex}!`
        });
      }
    } else {
      // Incorrect answer: deduct a life
      session.lives -= 1;

      if (session.lives <= 0) {
        // Game Over
        activeSessions.delete(sessionId);

        // Record partial score if user is logged in
        if (session.userId !== 'guest' && session.score > 0) {
          const user = await UserModel.findById(session.userId);
          if (user) {
            await UserModel.update(session.userId, {
              totalBananas: (user.totalBananas || 0) + session.score,
              gamesPlayed: (user.gamesPlayed || 0) + 1
            });
            await ScoreModel.record({
              userId: session.userId,
              username: session.username,
              avatar: session.avatar,
              difficulty: session.difficulty,
              puzzlesSolved: session.currentPuzzleIndex - 1,
              points: session.score,
              level: user.level || 1
            });
          }
        }

        return res.status(200).json({
          success: true,
          status: 'GAME_OVER',
          correct: false,
          livesRemaining: 0,
          totalScore: session.score,
          correctSolution: session.currentSolution,
          message: `Game Over! You ran out of lives. The correct answer was ${session.currentSolution}.`
        });
      } else {
        return res.status(200).json({
          success: true,
          status: 'WRONG_ANSWER',
          correct: false,
          livesRemaining: session.lives,
          message: `Oops! That's not correct. ${session.lives} ${session.lives === 1 ? 'heart' : 'hearts'} remaining.`
        });
      }
    }
  } catch (err) {
    console.error('[GameEngine] Submit answer error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process answer submission.'
    });
  }
};

/**
 * Power-up: AI Clue / Hint Generation
 */
exports.getAiHint = (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Game session not active' });
    }

    const hint = BananaApiService.generateAiHint(session.currentSolution);
    session.aiHintUsed = true;

    return res.status(200).json({
      success: true,
      hint,
      message: 'AI Hint generated!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not generate hint' });
  }
};

/**
 * Power-up: Time Freeze (+10 seconds bonus)
 */
exports.useTimeFreeze = (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Game session not active' });
    }

    if (session.usedFreeze) {
      return res.status(400).json({
        success: false,
        message: 'Time Freeze already utilized in this session.'
      });
    }

    session.usedFreeze = true;
    return res.status(200).json({
      success: true,
      freezeSeconds: 10,
      message: '❄️ Time Freeze activated! Timer frozen for 10 seconds.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not apply power-up' });
  }
};
