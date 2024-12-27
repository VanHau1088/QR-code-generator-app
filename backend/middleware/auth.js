// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'secretkey123');
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default auth;
