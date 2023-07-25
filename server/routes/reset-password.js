const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const hashPassword = require('../utils/pswhashing');
const router = express.Router();
const HttpError = require('../models/http-error');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

router.post('/api/reset-password', [
    check('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must include at least one uppercase letter, one lowercase letter, one digit, and one special symbol')
  ], async (req, res, next) => {

    const { token, newPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data. Password must be minimum of 8 characters including a capital letter, a lower-case letter, a number and a symbol.', 422)
      );
    }

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, 'secret');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
  
    // find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
  
    // save the new password
    user.password = await hashPassword(newPassword); 
    await user.save();
  
    res.json({ message: 'Password reset successful.' });
  });
  
  module.exports = router;    