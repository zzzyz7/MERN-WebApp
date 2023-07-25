const express = require('express');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const usersController = require('../controllers/user-controller');
const router = express.Router();
const User = require('../models/user');
const HttpError = require('../models/http-error');

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('firstname')
      .not()
      .isEmpty().withMessage('First name is required'),
    check('lastname')
      .not()
      .isEmpty().withMessage('Last name is required'),
    check('email')
      .normalizeEmail()
      .isEmail().withMessage('Invalid email format'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) //regular expression
      .withMessage('Password must include at least one uppercase letter, one lowercase letter, one digit, and one special symbol'),
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.get('/confirm-email', async (req, res, next) => {
  // Get the token from the URL
  const token = req.query.token;

  // Verify the token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    const error = new HttpError(
      'Email verification failed, please try again later.',
      500
    );
    return next(error);
  }

  // Get the user from the database using the id in the token
  // console.log("Token: ", decodedToken);
  let user;
  try {
    user = await User.findById(decodedToken.userId);
  } catch (err) {
    const error = new HttpError(
      'Email verification failed, please try again later.',
      500
    );
    return next(error);
  }

  // console.log("User: ", user);

  // If the user doesn't exist or is already verified, throw an error
  if (!user || user.emailVerified) {
    const error = new HttpError(
      'Email verification failed, please try again later.',
      500
    );
    return next(error);
  }

  // Otherwise, mark the user as verified and save them
  user.emailVerified = true;
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Email verification failed, please try again later.',
      500
    );
    return next(error);
  }
});

router.patch('/:userId', usersController.updateProfile);
router.patch('/:userId/changepassword', usersController.changePassword);

module.exports = router;
