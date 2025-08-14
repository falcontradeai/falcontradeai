const jwt = require('jsonwebtoken');

const authenticate = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  };
};

module.exports = { authenticate };
