/*eslint-disable*/
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
  });
}

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    next(new AppError('Please provide an email and password', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Invalid credentials', 401));
  }

  // if everything is good, send token to client
  createSendToken(user, 200, res);
});

// Protect route to only authenticated users
exports.protect = catchAsync(async (req, res, next) => {
  // Getting the token and check if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get acces.', 401));
  }

  // Verification token
  const verifyToken = promisify(jwt.verify);
  const decoded = await verifyToken(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exists', 404));
  }

  // Check if user changed password after the token was issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Your password has changed since you last logged in. Please log in again.', 401));
  }

  // Grant acces to protected routes
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You are not authorized to perform this action', 403));
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with that email address', 404));
  }

  // 2) Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  

  const resetUrl = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

  const message = `Forgot yor password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}. \n\n If you did not make this request, please ignore this email and your password will remain`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });
  
    res.status(200).json({
      status: 'success',
      message: 'An email has been sent with a reset token'
    }); 
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Could not send email. Try again later', 500));
  }
  
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //  Get user based on reset token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired', 400));
  }

  // Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Log the user in, send JWT
  createSendToken(user,200,res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  // If so, update the user's password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user,200,res);
});
