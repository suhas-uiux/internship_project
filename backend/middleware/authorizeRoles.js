module.exports = function authorizeRoles(allowedRoles = []) {
    return (req, res, next) => {
      try {
        const user = req.user; // You must have authentication middleware setting req.user
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized: No user info found' });
        }
  
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
  
        next();
      } catch (err) {
        console.error('Authorization error:', err);
        res.status(500).json({ message: 'Server error during authorization' });
      }
    };
  };