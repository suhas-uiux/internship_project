const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const authorizeRoles = require('../middleware/authorizeRoles');
const checkRole = require('../middleware/checkRole');

const router = express.Router();


// ==========================
// AUTH ROUTES
// ==========================

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, orgName, isCreatingOrg } = req.body;

    if (!name || !email || !password || !orgName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedOrgName = orgName.trim();

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    let organization;

    if (!isCreatingOrg) {
      organization = await Organization.findOne({ name: trimmedOrgName });
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found. Please check the name.' });
      }
    } else {
      const orgExists = await Organization.findOne({ name: trimmedOrgName });
      if (orgExists) {
        return res.status(400).json({ message: 'Organization name already taken. Please choose another.' });
      }

      organization = new Organization({ name: trimmedOrgName });
      await organization.save();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = isCreatingOrg ? 'admin' : 'member';

    const user = new User({
      name,
      email: trimmedEmail,
      password: hashedPassword,
      role: assignedRole,
      organization: organization._id
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        orgId: organization._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: organization.name
      }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('organization');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        orgId: user.organization._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization.name
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ==========================
// PROTECTED ROUTES
// ==========================

// @route   GET /api/auth/profile
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'This is your profile', user: req.user });
});

// @route   GET /api/auth/admin-only
router.get('/admin-only', authenticate, authorizeRoles(['admin']), (req, res) => {
  res.send(`Hello Admin ${req.user.name}`);
});

// @route   GET /api/auth/users - list users in same org
router.get('/users', authenticate, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const users = await User.find({ organization: req.user.orgId }).select('name email role');
    res.json(users);
  } catch (err) {
    console.error('Fetching users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/users/:id/promote - promote to manager
router.put('/users/:id/promote', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.organization.toString() !== req.user.orgId) {
      return res.status(404).json({ message: 'User not found in your organization.' });
    }

    if (user.role === 'manager') {
      return res.status(400).json({ message: 'User is already a manager.' });
    }

    user.role = 'manager';
    await user.save();

    res.status(200).json({ message: 'User promoted to manager.' });
  } catch (error) {
    console.error('Promote Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/auth/create-org (dummy)
router.post('/create-org', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Only admins can create organizations' });
});


module.exports = router;
