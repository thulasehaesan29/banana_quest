const { JsonDatabase, getIsMongoConnected } = require('../config/db');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Optional Mongoose Schema if MongoDB is active
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'happy-monkey' },
  totalBananas: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  daysPlayed: { type: Number, default: 1 },
  level: { type: Number, default: 1 },
  achievements: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

class UserModel {
  static async findByEmail(email) {
    if (getIsMongoConnected()) {
      return MongoUser.findOne({ email: email.toLowerCase().trim() });
    }
    const db = JsonDatabase.read();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  static async findByUsername(username) {
    if (getIsMongoConnected()) {
      return MongoUser.findOne({ username: username.trim() });
    }
    const db = JsonDatabase.read();
    return db.users.find(u => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
  }

  static async findById(id) {
    if (getIsMongoConnected()) {
      return MongoUser.findById(id);
    }
    const db = JsonDatabase.read();
    return db.users.find(u => u.id === id) || null;
  }

  static async create(userData) {
    if (getIsMongoConnected()) {
      const user = new MongoUser(userData);
      return user.save();
    }
    const db = JsonDatabase.read();
    const newUser = {
      id: 'user-' + crypto.randomUUID(),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      username: userData.username.trim(),
      password: userData.password,
      avatar: userData.avatar || 'happy-monkey',
      totalBananas: userData.totalBananas || 0,
      highScore: userData.highScore || 0,
      gamesPlayed: userData.gamesPlayed || 0,
      daysPlayed: userData.daysPlayed || 1,
      level: userData.level || 1,
      achievements: userData.achievements || [],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    db.users.push(newUser);
    JsonDatabase.write(db);
    return newUser;
  }

  static async update(id, updates) {
    if (getIsMongoConnected()) {
      return MongoUser.findByIdAndUpdate(id, updates, { new: true });
    }
    const db = JsonDatabase.read();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates };
    JsonDatabase.write(db);
    return db.users[index];
  }

  static async getAll() {
    if (getIsMongoConnected()) {
      return MongoUser.find({});
    }
    const db = JsonDatabase.read();
    return db.users;
  }
}

module.exports = UserModel;
