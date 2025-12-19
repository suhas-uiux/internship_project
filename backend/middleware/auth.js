const jwt = require('jsonwebtoken');



const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Get the token part

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (userId, role, orgId) to request
    next(); // Go to next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;