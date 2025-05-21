// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['researcher', 'explorer'],
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
