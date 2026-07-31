module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'HR') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: HR/Admin permissions required' });
  }
};
