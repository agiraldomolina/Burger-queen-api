/*eslint-disable*/
const mongoose = require('mongoose');
const AppError = require('../utils/appError')

const productOrderSchema = new mongoose.Schema(
  {
    qty: { type: Number, required: true },
    product: {
      id: { type: String },
      name :{ type: String },
      price: Number,
      image: { type: String },
      type: { type: String },
      dateEntry: Date,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  client: {
    type: String,
    required: [true, 'Please write a name!'],
  },

  products: 
    [
  productOrderSchema
    ]
  ,
  status: {
    type: String,
    enum: ['pending', 'canceled', 'delivering', 'delivered'],
  },
  dataEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: Date,
},
{ versionKey: false },
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
},
);

orderSchema.pre('save' , { runValidators: false }, async function (next) {
  
  if(this.products.length === 0) next(new AppError('Please add products to order', 400))
})

// Middleware that executes populate on each query
orderSchema.pre(/^find/, function (next) {
  this .populate({
    path: 'userId',
    select: '_id'
  })
  next();
});

orderSchema.pre('save',  async function (next) {
  if (this.status === 'delivered') {
    console.log('hello from delivered');
    console.log('hello from delivered');
    this.dateProcessed = Date.now();
  } else {
    this.dateProcessed = undefined;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
