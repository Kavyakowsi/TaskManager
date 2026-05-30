const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, access denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing, access denied.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyfortaskmanagerapplicationauth');
    
    // Set userId on request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(`Auth Middleware Error: ${error.message}`);
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

module.exports = auth;
