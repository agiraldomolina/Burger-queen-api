/* eslint-disable*/
const Product = require('../models/productModel')
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllProducts = catchAsync(async (req, res,next) =>{
    //const products = await Product.find();
    const features = new APIFeatures(Product.find(), req.query)
    .paginate()
    const products = await features.query;
    //Send TO THE CLIENT
    res.status(200).json({
        status:'success',
        results: products.length,
        data: {
            products
        }
    });
});

exports.updateProduct = catchAsync(async (req, res) =>{
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true,
          });
    if (!updatedProduct) {
    return next(new AppError('No product found with that ID', 404));
    }
   
    res.status(200).json({
        status:'success',
        data: {
            updatedProduct
        }
    })       
})


exports.getProduct = catchAsync( async(req, res) =>{
    const tour = await Product.findById(req.params.id);
    res.status(200).json({
        status:'success',
        data: {
            tour
        }
    });    
})

exports.createProduct =catchAsync( async (req, res) =>{
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        status:'success',
        data: {
            product: newProduct
        }
    });
});

exports.deleteProduct = factory.deleteOne(Product);


exports.getAvgPrice = async (req, res) =>{
    try {
        const avgPrice = await Product.aggregate([
            {
                $group: {
                    _id: { $toUpper: '$type'},
                    avgPrice: {
                        $avg: '$price'
                    }
                }
            }
        ]);
        res.status(200).json({
            status:'success',
            data: {
                avgPrice
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


