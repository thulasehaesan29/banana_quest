/**
 * Virtual Identity Controller
 * 
 * Manages user lifecycle, registration, secure credential hashing (bcrypt),
 * JSON Web Token generation, and cookie management.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Set token in HTTP-only cookie for secure browser handling
const sendTokenResponse = (res, user, statusCode = 200, message = 'Success') => {
  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar || 'happy-monkey',
      totalBananas: user.totalBananas || 0,
      highScore: user.highScore || 0,
      gamesPlayed: user.gamesPlayed || 0,
      daysPlayed: user.daysPlayed || 1,
      level: user.level || 1,
      achievements: user.achievements || []
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, username, password, confirmPassword, agreeTerms, avatar } = req.body;

    // 1. Validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, username, password) are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 2. Check Uniqueness
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'This username is already taken. Please choose another.'
      });
    }

    // 3. Password Hashing (Cryptographic Security for Virtual Identity)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create User Record
    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      password: hashedPassword,
      avatar: avatar || 'happy-monkey',
      totalBananas: 50, // Welcome gift bananas!
      highScore: 0,
      gamesPlayed: 0,
      daysPlayed: 1,
      level: 1,
      achievements: ['welcome_monkey']
    });

    console.log(`[Auth] Registered new user identity: ${newUser.username} (${newUser.email})`);
    return sendTokenResponse(res, newUser, 201, 'Account successfully created! Welcome to Banana Quest.');
  } catch (err) {
    console.error('[Auth] Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Compare with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update last login
    await UserModel.update(user.id || user._id, {
      lastLogin: new Date().toISOString()
    });

    console.log(`[Auth] User authenticated: ${user.username}`);
    return sendTokenResponse(res, user, 200, 'Welcome back!');
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

exports.quickDemoLogin = async (req, res) => {
  try {
    let demoUser = await UserModel.findByEmail('alex@bananaquest.com');
    if (!demoUser) {
      // Re-seed demo user if missing
      const hashedPassword = await bcrypt.hash('banana123', 10);
      demoUser = await UserModel.create({
        name: 'Alex Johnson',
        email: 'alex@bananaquest.com',
        username: 'alex',
        password: hashedPassword,
        avatar: 'glasses-monkey',
        totalBananas: 120,
        highScore: 240,
        gamesPlayed: 14,
        daysPlayed: 3,
        level: 4,
        achievements: ['first_banana', 'puzzle_master']
      });
    }
    return sendTokenResponse(res, demoUser, 200, 'Signed in as Demo User Alex!');
  } catch (err) {
    console.error('[Auth] Quick login error:', err);
    return res.status(500).json({ success: false, message: 'Demo login error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        totalBananas: user.totalBananas,
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
        daysPlayed: user.daysPlayed,
        level: user.level,
        achievements: user.achievements
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (avatar) updates.avatar = avatar;

    const updatedUser = await UserModel.update(req.user.id, updates);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id || updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        totalBananas: updatedUser.totalBananas,
        level: updatedUser.level
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Update failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};
