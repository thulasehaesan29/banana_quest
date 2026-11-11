const { JsonDatabase, getIsMongoConnected } = require('../config/db');
const mongoose = require('mongoose');
const crypto = require('crypto');

const ScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, default: 'happy-monkey' },
  difficulty: { type: String, required: true },
  puzzlesSolved: { type: Number, default: 0 },
  points: { type: Number, required: true },
  level: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now }
});

const MongoScore = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

class ScoreModel {
  static async record(scoreData) {
    if (getIsMongoConnected()) {
      const score = new MongoScore(scoreData);
      return score.save();
    }
    const db = JsonDatabase.read();
    const newScore = {
      id: 'score-' + crypto.randomUUID(),
      userId: scoreData.userId,
      username: scoreData.username,
      avatar: scoreData.avatar || 'happy-monkey',
      difficulty: scoreData.difficulty,
      puzzlesSolved: scoreData.puzzlesSolved || 1,
      points: scoreData.points,
      level: scoreData.level || 1,
      timestamp: new Date().toISOString()
    };
    db.scores.push(newScore);
    JsonDatabase.write(db);
    return newScore;
  }

  static async getLeaderboard(period = 'all-time', limit = 20) {
    let scores = [];
    if (getIsMongoConnected()) {
      scores = await MongoScore.find({}).lean();
    } else {
      const db = JsonDatabase.read();
      scores = db.scores || [];
    }

    const now = Date.now();
    let filtered = scores;

    if (period === 'daily') {
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      filtered = scores.filter(s => new Date(s.timestamp).getTime() >= oneDayAgo);
    } else if (period === 'weekly') {
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
      filtered = scores.filter(s => new Date(s.timestamp).getTime() >= oneWeekAgo);
    }

    // Group by user to show best points or aggregate
    const userBest = {};
    for (const entry of filtered) {
      if (!userBest[entry.userId] || entry.points > userBest[entry.userId].points) {
        userBest[entry.userId] = { ...entry };
      }
    }

    const ranked = Object.values(userBest)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

    return ranked;
  }

  static async getUserRank(userId, period = 'all-time') {
    const list = await this.getLeaderboard(period, 1000);
    const userEntry = list.find(s => s.userId === userId);
    return userEntry ? userEntry.rank : null;
  }
}

module.exports = ScoreModel;
