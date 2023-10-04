/* eslint-disable */
const AppError = require('../utils/appError');

const handleJWTError = () => new AppError('invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

 const handleValidationErrorDB = (err) => {
    const message = 'Validation Error';
    return new AppError(message, 400);
  };

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value! `;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev=(err,res)=>{
  
  res.status(err.statusCode).json({
    status: res.status,
    message: err.message,
    error: err.message, 
    stack: err.stack,
  });
}

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });

  // Programming or other unknown error: don't leak error details
  }else{
    // Log the error
    console.error('ERROR 💥', err)
    // Send generic message
    res.status(500).json({
      message: 'Something went very wrong',
    })
  }
}

module.exports = (err,req,res,next) => {
  console.log(err.stack)
  err.statusCode = err.statusCode || 500;
  err.status= err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err,res);
  }else if(process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));
    if(error.name === 'CastError') error= handleCastErrorDB(error)
    // next if is the hadler forvalidation duplicated names
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // next if is the hadler for validation issues
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    // next if is the hadler for jwt error
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error,res)
  }
}
