const User = require('../models/user');
const Phone = require('../models/phone'); 
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const hashPassword = require('../utils/pswhashing');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const ObjectId = require('mongodb').ObjectId

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); //find all documents in user collection, exclude password
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) }); //send json response to the client with array of user object
};

const getUsersById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("Phone not found");
    }
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data. Password must be minimum of 8 characters including a capital letter, a lower-case letter, a number and a symbol.', 422)
    );
  }
  const { firstname, lastname, email, password } = req.body;
  const hashedPassword = await hashPassword(password); // password hashing by bcrypt

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPassword,
    emailVerified: false,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  const token = jwt.sign({ userId: createdUser._id }, 'secret', { expiresIn: '1d' });

  // Send verification email
  try {
    await sendVerificationEmail(createdUser, token);
  } catch (err) {
    const error = new HttpError(
      'Sending email failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) { //if user is not exist
    const error = new HttpError(
      'User is not existed, could not log you in.',
      401
    );
    return next(error);
  }

  if (!existingUser.emailVerified) { //if user does not verify
    const error = new HttpError(
      'User is not verified, could not log you in, please check your email.',
      401
    );
    return next(error);
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password); //compare the password hashed in database

  if (!isPasswordValid) {
    const error = new HttpError(
      'Password is not correct, could not log you in.',
      401
    );
    return next(error);
  }

  const token = jwt.sign({ userId: existingUser._id }, 'secret', { expiresIn: '1d' });

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
    token: token 
  });
};

const updateProfile = async (req, res, next) => {
  const { currentUserId, firstname, lastname, email } = req.body;

  let user;
  try {
    user = await User.findById(currentUserId);
    console.log(user)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update the profile.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('User not found.', 404);
    return next(error);
  }

  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update the profile.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Profile updated successfully.' });
};

const changePassword = async (req, res, next) => {
  const { userId, currentPassword, newPassword } = req.body;
  console.log(userId)
  console.log(currentPassword)
  console.log(newPassword)

  let user;
  try {
    user = await User.findById(userId);
    console.log(user)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not change the password.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('User not found.', 404);
    return next(error);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const error = new HttpError('Incorrect current password.', 400);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not change the password.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Password changed successfully.' });
};

const checkPassword = async (req, res, next) => {
  const { currentUserId, password } = req.body;

  let user;
  try {
    // console.log(currentUserId);
    user = await User.findById(currentUserId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not change the password.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('User not found.', 404);
    return next(error);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  // collection.log(isPasswordValid);
  if (!isPasswordValid) {
    const error = new HttpError('Incorrect current password.', 400);
    return next(error);
  }

  res.status(200).json({ passwordIsValid: true, message: 'Password checked successfully.' });
};

const getCommentsByReviewer = async (req, res, next) => {

  const reviewerId = req.query.id;
  console.log(reviewerId);

  let phones;
  try {
    phones = await Phone.find({ 'reviews.reviewer': new ObjectId(reviewerId) });
    console.log("Phones:", phones);

  } catch (err) {
    const error = new HttpError(
      'Fetching comments failed, please try again later.',
      500
    );
    return next(error);
  }

  const commentsByReviewer = phones.reduce((allComments, phone) => {
    // Check if reviews exist
    if (phone.reviews && phone.reviews.length > 0) {
      const comments = phone.reviews.filter(review => review.reviewer && review.reviewer.toString() === reviewerId);
      return allComments.concat(comments);
    }
    // If no reviews, just return the all comments array as is
    return allComments;
  }, []);

  res.json({ comments: commentsByReviewer });
};

exports.changePassword = changePassword;
exports.getUsers = getUsers;
exports.getUsersById = getUsersById;
exports.signup = signup;
exports.login = login;
exports.updateProfile = updateProfile;
exports.checkPassword = checkPassword;
exports.getCommentsByReviewer = getCommentsByReviewer;
