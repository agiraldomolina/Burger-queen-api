/*eslint-disable*/
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

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

    // Update user document

    res.status(200).json({
      status:'success',
    })

  })
  
  exports.updateUser = catchAsync(async (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route for update user is not yet implemented',
      });
    // const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body,
    //     {
    //         new: true,
    //         runValidators: true,
    //       });
    // if (!updatedOrder) {
    // return next(new AppError('No order found with that ID', 404));
    // }
   
    // res.status(200).json({
    //     status:'success',
    //     data: {
    //         updatedOrder
    //     }
    // })       
  })
  
  
  exports.getUser = catchAsync( async(req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route for get user is not yet implemented',
      });
    // const order = await Order.findById(req.params.id);
    // res.status(200).json({
    //     status:'success',
    //     data: {
    //         order
    //     }
    // });    
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
  
  exports.deleteUser = catchAsync(async (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented',
      });
    // await Order.findByIdAndDelete(req.params.id);
    // res.status(204).json({
    //     status:'success',
    //     data: null
    // });
  });
  