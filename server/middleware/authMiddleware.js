const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'forge_secret_key_123_abc';

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization denied: Token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    return res.status(401).json({ success: false, message: 'Authorization denied: Invalid token' });
  }
};
