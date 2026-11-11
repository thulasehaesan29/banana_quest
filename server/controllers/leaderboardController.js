/**
 * Leaderboard & Competitive Ranking Controller
 * 
 * Provides time-sliced ranking (Daily, Weekly, All-Time)
 * and personal position analytics for player virtual identities.
 */

const ScoreModel = require('../models/Score');

exports.getLeaderboard = async (req, res) => {
  try {
    const period = req.query.period || 'all-time';
    const limit = parseInt(req.query.limit, 10) || 10;

    const rankings = await ScoreModel.getLeaderboard(period, limit);

    // If user is authenticated, compute their personal position
    let myPosition = null;
    if (req.user) {
      const userRank = await ScoreModel.getUserRank(req.user.id, period);
      myPosition = {
        rank: userRank || 'Unranked',
        username: req.user.username,
        avatar: req.user.avatar,
        points: req.user.highScore || 0,
        level: req.user.level || 1,
        totalBananas: req.user.totalBananas || 0
      };
    }

    return res.status(200).json({
      success: true,
      period,
      rankings,
      myPosition
    });
  } catch (err) {
    console.error('[Leaderboard] Error fetching rankings:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard.'
    });
  }
};
