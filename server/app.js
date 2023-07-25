const user_controller= require('./controllers/user-controller');
const phones_controller = require('./controllers/phone-controller');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users-routes');
const reset_password_request = require('./routes/reset-password-request');
const reset_password = require('./routes/reset-password');
const HttpError = require('./models/http-error');
const cors = require('cors');

mongoose.connect(
  'mongodb://localhost:27017/comp5347'
).then(() => {
    console.log('Connected to database!')
}).catch(() => {
    console.log('Connection failed!')
});

var app = express();
app.use(bodyParser.json());
app.use(cors());
/*
All domain names (*) are allowed to initiate cross-origin requests
It also allows some common request headers such as Origin, X-Requested-With, Content-Type, Accept, and Authorization.
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/images', express.static(__dirname + '/public/images'));
app.use('/api/users', usersRoutes);
app.get('/confirm-email', usersRoutes)
app.post('/api/reset-password-request', reset_password_request);
app.post('/api/reset-password', reset_password);
app.post('/api/upload-phones', phones_controller.createPhone);
app.post('/api/comments', phones_controller.addComment);
app.post('/api/checkPassword', user_controller.checkPassword);
app.post('/api/update', user_controller.updateProfile);
app.post('/api/changepassword', user_controller.changePassword);
app.get('/api/phones', phones_controller.getPhones);
app.get('/api/phones/:id', phones_controller.getPhoneById);
app.get('/api/users/:id', user_controller.getUsersById);
app.get('/api/getSoldOutSoonPhones', phones_controller.getSoldOutSoonPhones);
app.get('/api/bestSellersPhones', phones_controller.getBestSellersPhones);
app.get('/api/user/:userId/listings', phones_controller.getUserListings);
app.get('/api/comments', user_controller.getCommentsByReviewer);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const userController = require('./controllers/user-controller'); // Import user controller

app.patch('/api/users/:userId', userController.updateProfile); // Use userController instead of user - Controller

app.listen(4000, () => {
  console.log('App is listening on port 4000.');
});

module.exports = app;
