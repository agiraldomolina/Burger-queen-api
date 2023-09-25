/*eslint-disable*/
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    // required: [true, 'Please provide a role'],
    enum: ['admin', 'waiter','chef'],
    default: 'waiter',
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    trim: true,
    maxLength: [40, 'A user email must be less than 40 characters'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    trim: true,
    minLength: [8, 'A user password must be at least 8 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password'],
    validate: {
      // This only works on CREATE and SAVE!!
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Nest middleware encryts the password
userSchema.pre('save', async function (next) {
  // Only run this function when the password has been modified
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // after the password has been saved and hashed passwrordConfirm is not necessary to be stored in the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

     return JWTTimestamp < changedTimestamp; // true if password changed after token
  }

  return false;
};

const User = mongoose.model('User', userSchema); // model for creating doccuments

module.exports = User;