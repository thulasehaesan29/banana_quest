const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if db.json does not exist
const initialData = {
  users: [
    {
      id: 'demo-user-1',
      name: 'Alex Johnson',
      email: 'alex@bananaquest.com',
      username: 'alex',
      // Password hash for 'banana123'
      password: '$2a$10$wE3/p09/4gJj1n89g4L8o.8P5lK3mE.jR7zB/K9o2p1q0r9s8t7u6',
      avatar: 'glasses-monkey',
      totalBananas: 120,
      highScore: 240,
      gamesPlayed: 14,
      daysPlayed: 3,
      level: 4,
      achievements: ['first_banana', 'puzzle_master'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date().toISOString()
    }
  ],
  scores: [
    {
      id: 'score-1',
      userId: 'demo-user-1',
      username: 'alex',
      avatar: 'glasses-monkey',
      difficulty: 'medium',
      puzzlesSolved: 2,
      points: 240,
      timestamp: new Date().toISOString()
    },
    {
      id: 'score-2',
      userId: 'demo-bot-1',
      username: 'KingKong99',
      avatar: 'super-monkey',
      difficulty: 'hard',
      puzzlesSolved: 3,
      points: 380,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'score-3',
      userId: 'demo-bot-2',
      username: 'ChimpChampion',
      avatar: 'happy-monkey',
      difficulty: 'hard',
      puzzlesSolved: 3,
      points: 310,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'score-4',
      userId: 'demo-bot-3',
      username: 'BananaBaron',
      avatar: 'ninja-monkey',
      difficulty: 'medium',
      puzzlesSolved: 2,
      points: 190,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'score-5',
      userId: 'demo-bot-4',
      username: 'JunglePro',
      avatar: 'space-monkey',
      difficulty: 'easy',
      puzzlesSolved: 1,
      points: 90,
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
    }
  ],
  activeGames: {}
};

// Initialize file database if not present
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
}

// Low-overhead JSON Database Helper
class JsonDatabase {
  static read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[DB] Error reading db.json:', err.message);
      return initialData;
    }
  }

  static write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('[DB] Error writing db.json:', err.message);
      return false;
    }
  }
}

let isMongoConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB successfully.');
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed. Falling back to built-in JSON file store:', err.message);
      isMongoConnected = false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Using reliable built-in JSON file store at server/data/db.json');
  }
};

module.exports = {
  connectDB,
  JsonDatabase,
  getIsMongoConnected: () => isMongoConnected
};
