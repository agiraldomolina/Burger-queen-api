/*eslint-disable*/
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const signToken = (id) => {
//   return jwt.sign(
//     {
//       id,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     },
//   );
// };

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
//     ),
//     httpOnly: true,
//   };
//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

//   res.cookie('jwt', token, cookieOptions);

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };


// exports.createUser = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);
//   res.status(201).json({
//     status:'success',
//     data: {
//       user: newUser,
//     },
//   })
// });

exports.getAllUser = catchAsync(async (req, res,next) =>{
  res.status(500).json({
      status: 'error',
      message: 'This route for users is not yet implemented',
    });
  // const features = new APIFeatures(Order.find(), req.query)
  // .paginate()
  // const users = await features.query;
  // //Send TO THE CLIENT
  // res.status(200).json({
  //     status:'success',
  //     results: users.length,
  //     data: {
  //         users
  //     }
  // });
});

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

// exports.createUser =catchAsync( async (req, res) =>{
//   res.status(500).json({
//       status: 'error',
//       message: 'This route is not yet implemented',
//     });
//   // const newOrder = await Order.create(req.body);
//   // res.status(201).json({
//   //     status:'success',
//   //     data: {
//   //         Order: newOrder
//   //     }
//   // });
// });

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




