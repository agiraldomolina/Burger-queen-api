/*eslint-disable*/
//const Order = require('../models/orderModel')
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllOrders = catchAsync(async (req, res,next) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route for orders is not yet implemented',
      });
    // const features = new APIFeatures(Order.find(), req.query)
    // .paginate()
    // const orders = await features.query;
    // //Send TO THE CLIENT
    // res.status(200).json({
    //     status:'success',
    //     results: orders.length,
    //     data: {
    //         orders
    //     }
    // });
});

exports.updateOrder = catchAsync(async (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route for update is not yet implemented',
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


exports.getOrder = catchAsync( async(req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented',
      });
    // const order = await Order.findById(req.params.id);
    // res.status(200).json({
    //     status:'success',
    //     data: {
    //         order
    //     }
    // });    
})

exports.createOrder =catchAsync( async (req, res) =>{
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

exports.deleteOrder = catchAsync(async (req, res) =>{
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
