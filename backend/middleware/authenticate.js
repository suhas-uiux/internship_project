// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      orgId: user.organization,
      name: user.name
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token verification failed' });
  }
};
