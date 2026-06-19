const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
  let token = null;

  // Try cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Fallback to Authorization header
  const header = req.headers.authorization;
  if (!token && header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.JWT_SECRET = JWT_SECRET;
