/* eslint-disable*/
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async(req, res) => {
    const products = await Product.find();
    res.status(200).render('overview', {
      title: 'Whole Menu',
      products
    });
  });
  
exports.getMenu = catchAsync(async(req, res,next) => {
  const products = await Product.find();
    res.status(200).render('menu', {
      title: 'Menu Details',
      products
    });
  });
  