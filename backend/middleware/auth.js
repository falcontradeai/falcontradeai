const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify JWT tokens and attach the user to the request
async function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Ensure the authenticated user has an active subscription
function requireActiveSubscription(req, res, next) {
  if (
    req.user &&
    req.user.role === 'subscriber' &&
    req.user.subscriptionStatus !== 'active'
  ) {
    return res
      .status(403)
      .json({ message: 'Subscription inactive' });
  }
  next();
}

// Export the auth function with an additional helper for subscription checks
auth.requireActiveSubscription = requireActiveSubscription;

module.exports = auth;


