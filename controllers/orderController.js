/// *eslint-disable */
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllOrders = catchAsync(async (req, res) => {
  const features = new APIFeatures(Order.find(), req.query)
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

exports.getOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
