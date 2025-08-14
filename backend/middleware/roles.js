// Middleware helpers for role-based authorization

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
}

function isSubscriber(req, res, next) {
  if (req.user && req.user.role === 'subscriber') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
}

module.exports = { isAdmin, isSubscriber };

