/*eslint-disable */
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// Middleware used for get id from authenticated user
exports.setUserId = (req, res, next) => {
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};

exports.createOrder = factory.createOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);


