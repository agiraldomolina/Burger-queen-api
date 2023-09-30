/*eslint-disable */
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createOrder = factory.createOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.getAllOrders = catchAsync(async (req, res,next) => {
  // With this filter and merge option in the order Routes its possible to nest paths: /GET /users/:userId/orders
  let filter = {};
  if(req.params.userId) filter = { user: req.params.userId };
  const features = new APIFeatures(Order.find(filter), req.query)
    .paginate();
  const orders = await features.query;
  // Send TO THE CLIENT
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

// exports.createOrder = catchAsync(async (req, res) => {
//   if (!req.body.user) req.body.user = req.user.id;
//   const newOrder = await Order.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       order: newOrder,
//     },
//   });
// });

exports.updateOrder = catchAsync(async (req, res, next) => {
  try {
    await Order.findById(req.params.id);
  } catch (err) {
    return next(new AppError('No order found with that ID', 404));
  }

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (updatedOrder.status === 'delivered') {
    updatedOrder.dateProcessed = Date.now();
  } else {
    updatedOrder.dateProcessed = undefined;
  }
  await updatedOrder.save();

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

exports.getOrder = catchAsync(async (req, res,next) => {
  const order = await Order.findById(req.params.id)
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});


