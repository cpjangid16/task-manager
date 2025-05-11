const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token, access denied' 
      });
    }

    // Check if token is in correct format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format. Use Bearer token' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      // Find user
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'username', 'email', 'role']
      });

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT Error:', jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token has expired' 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

module.exports = auth; 