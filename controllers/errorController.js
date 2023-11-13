/* eslint-disable */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: '${value}'. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);

  const message = `Validation Error: ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, res) => {
  // console.log('hi from sendErrorDev');
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error, we don't want to leak error details to client
  } else {
    // 1) Log the error
    console.error('ERROR 💥 ', err.stack);
    // 2) Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went  very wrong!',
    });
  }
};

exports.cathMyErrors = (err, req, res) => {
  const myError = { ...err };
  myError.statusCode = myError.statusCode || 500;
  myError.status = myError.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));

    // next if is the hadler for CastError
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // next if is the hadler forvalidation duplicated names
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // next if is the hadler for validation issues
    if (error.name === 'ValidationError') { error = handleValidationErrorDB(error); }
    // next if is the hadler for jwt error
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message
//     });
//   }
