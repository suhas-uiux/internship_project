const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// ==========================
// AUTH ROUTES
// ==========================

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, degree, branch, semesterCompleted, resume } = req.body;

    // Validation
    if (!username || !password || !fullName || !degree || !branch || !semesterCompleted) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check duplicate username
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      degree: degree.trim(),
      branch: branch.trim(),
      semesterCompleted,
      resume: resume || undefined,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        degree: newUser.degree,
        branch: newUser.branch,
        semesterCompleted: newUser.semesterCompleted,
        resume: newUser.resume || null,
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password.' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        degree: user.degree,
        branch: user.branch,
        semesterCompleted: user.semesterCompleted,
        resume: user.resume || null,
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   POST /api/auth/logout
router.post('/logout', authenticate, (req, res) => {
  // Since JWT is stateless, logout on server just confirms
  res.status(200).json({ message: 'Logged out successfully. Remove token from client.' });
});

// ==========================
// PROFILE ROUTE
// ==========================

// @route   GET /api/auth/profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

module.exports = router;
