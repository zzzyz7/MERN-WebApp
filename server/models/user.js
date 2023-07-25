const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true
  },
  emailVerified:{
    type: Boolean,
  }, 
  }, {
    versionKey: false 
  });
  

module.exports = mongoose.model('User', userSchema); //map to the mongodb database collection with name "users"