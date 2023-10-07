/*eslint-disable*/
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Middleware to get Id of logged in user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Middleware to allow logged in user or admin to update
exports.setAllowed = (req, res, next) => {
  console.log('Hi from setAllowed');
  // Only admin is allowed to update role
  if((req.user.id === req.params.id  && !req.body.role) || req.user.role === 'admin') {
    console.log('Hi from first if');
    next();
  }else{
    console.log('You are not logged in');
    return next(new AppError('You do not have permission to perform this action', 403))
  }
};


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser= factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);


// Next code was hicking up to be used in the future

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  console.log(newObj);
  return newObj;
};



  exports.updateMe = catchAsync(async (req, res,next) =>{
    // Upadate cuurent user
    // Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password update, please use /updateMyPasssword', 500));
    }

    /* Filtered out unwanted fields names that are not allowed to be updated 
    by now it's just the name but in later versions could be more fields
    In this way a regular user cannot change its role to admin*/
    const filteredBody = filterObject(req.body,'email');

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
    console.log(updatedUser);

    re.json({
      status:'success',
      data: {
        user:  updatedUser
      }
    })

  });

  exports.deleteMe = catchAsync(async (req, res,next) =>{
    // Get user and desactivate based on email    
    await User.findByIdAndUpdate(req.user.id, {active: false}, {new: true});

    res.status(204).json({
      status:'success',
      message: 'User deleted successfully',
      data: {
       data: null,
      },
    })

  });

  exports.unDeleteMe = catchAsync(async (req, res, next) =>{
    // Get and activate user based on email    
    const unDeletedUser = await User.findOneAndUpdate({email: req.body.email}, {active: true}, { returnOriginal: false
    });
    if (!unDeletedUser) {
      return next(new AppError('No user found with that email address', 404))
    };

    res.status(200).json({
      status:'success',
      message: 'User undeleted successfully',
      data: {
        data: unDeletedUser,
      },
    })
  });

  exports.createUser = catchAsync(async (req, res,next) =>{
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined. Please use /signup instead',
      data: null,
    })
  });

 
  