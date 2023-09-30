/*eslint-disable*/
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

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

exports.getAllUser = catchAsync(async (req, res,next) =>{
    const features = new APIFeatures(User.find(), req.query)
    .paginate()
    const users = await features.query;
    //Send TO THE CLIENT
    res.status(200).json({
        status:'success',
        results: users.length,
        data: {
            users
        }
    });
  });

  exports.updateMe = catchAsync(async (req, res,next) =>{
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

    res.status(200).json({
      status:'success',
      data: {
        user:  updatedUser
      }
    })

  });

  exports.deleteMe = catchAsync(async (req, res,next) =>{
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
    // Get and update user based on email    
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
  })
  
  exports.updateUser= catchAsync(async (req, res) =>{
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true,
          });
    if (!updatedUser) {
    return next(new AppError('No product found with that ID', 404));
    }
   
    res.status(200).json({
        status:'success',
        data: {
            updatedUser
        }
    })       
})
  
  
  exports.getUser = catchAsync( async(req, res) =>{
    const user = await User.findById(req.params.id).populate('orders');
    res.status(200).json({
        status:'success',
        data: {
            user
        }
    });    
  })
  
  exports.createUser =catchAsync( async (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented',
      });
    // const newOrder = await Order.create(req.body);
    // res.status(201).json({
    //     status:'success',
    //     data: {
    //         Order: newOrder
    //     }
    // });
  });

  exports.deleteUser = factory.deleteOne(User);
  