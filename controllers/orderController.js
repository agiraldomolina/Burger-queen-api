/// *eslint-disable */
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');

exports.getAllOrders = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};

exports.getOrder = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};

exports.createOrder = catchAsync(async (req, res) => {
  const newOrder = await Order.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  // const order = await Order.findById(req.params.id);
  // if (!order) {
  //   return next(new AppError('No order found with that ID', 404));
  // }
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedOrder) {
    return next(new AppError('No order found with that ID', 404));
  }
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

exports.deleteOrder = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};
