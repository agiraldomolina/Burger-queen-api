/*eslint-disable */
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// Middleware used for get id from authenticated user
exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createOrder = factory.createOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);

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

