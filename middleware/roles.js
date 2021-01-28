const requireRole = (role) => (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

  if (req.user && req.user.role.includes(role)) {
    next();
    return;
  }

  res.status(403).send('Operation is not permitted');
};

module.exports = {
  requireRole,
};
