/*eslint-disable*/
const mongoose = require('mongoose');
const Product = require('../models/productModel');

const productOrderSchema = new mongoose.Schema(
  {
    qty: { type: Number, required: true },
    product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  client: {
    type: String,
    required: [true, 'Please write a name!'],
  },

  products: 
    [productOrderSchema]
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
});

orderSchema.pre('updateOne', async function (next) {
// Only run when status is modified
// console.log("hello from orderSchema pre save");
// console.log(this.isModified('client'));
// console.log(this.isNew);
  // if (!this.isModified('status') || this.isNew) {
  //   console.log("hi there");
  //   return next()};

  if (this.status === 'delivered') {
    console.log("hi there delivered");
    this.dateProcessed = Date.now();
    console.log(this);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
