'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// a pre save hook - function that will run before we save an instance of a user into db
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next;
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

// compares password provided by user against the one stored in the db
userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;

  // we use promises so we can use async await when comparing passwords
  // bcrypt relies on callbacks entirely
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

mongoose.model('User', userSchema);