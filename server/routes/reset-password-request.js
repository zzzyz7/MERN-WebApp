const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendResetPassword= require('../utils/sendResetPassword');
const router = express.Router();
const HttpError = require('../models/http-error');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');


router.post('/api/reset-password-request', [
  check('email')
  .normalizeEmail()
  .isEmail().withMessage('Invalid email format')], 
  async (req, res, next) => {

  const { email } = req.body;
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Email format is invalid.', 422)
      );
    }
  
  // find the user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'No user found with this email.' });
  }

  // create token
  const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

  // send the email to the user
  try {
    await sendResetPassword(user, token);
  } catch (err) {
    const error = new HttpError(
      'Sending email failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ message: 'Password reset link sent.' });
});

module.exports = router;    