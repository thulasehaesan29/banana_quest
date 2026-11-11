/**
 * Virtual Identity & Authentication Middleware
 * 
 * Verifies JWT tokens delivered via either:
 *  - HTTP-only Cookies ('token')
 *  - HTTP Authorization Bearer headers ('Authorization: Bearer <token>')
 * 
 * Addresses Unit Themes:
 * - Theme 4: Virtual Identity (Authentication, Token Claims, Identity Protection)
 * - Week 5 Syllabus: Authentication & Cookies
 */

const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'banana_quest_enterprise_secret_key_2026';

const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Check HTTP Cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Virtual identity token missing. Please log in.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Retrieve user entity to verify identity still exists
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Virtual identity not recognized. User no longer exists.'
      });
    }

    // Attach user profile to request context
    req.user = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      totalBananas: user.totalBananas,
      level: user.level,
      highScore: user.highScore
    };

    next();
  } catch (err) {
    console.error('[AuthMiddleware] Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.id);
      if (user) {
        req.user = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar
        };
      }
    }
  } catch {
    // Ignore error for optional authentication
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET
};
