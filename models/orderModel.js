/*eslint-disable*/
const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
  qty: Number,
  product: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
});

const orderSchema = new mongoose.Schema({
  client: String,
  products: [productOrderSchema],
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

orderSchema.pre('findOneAndUpdate', async function (next) {
// Only run when status is modified
// console.log("hello from orderSchema pre save");
// console.log(this.isModified('client'));
// console.log(this.isNew);
//   if (!this.isModified('status') || this.isNew) {
//     console.log("hi there");
//     return next()};

  if (this.status === 'delivered') {
    console.log("hi there delivered");
    this.dateProcessed = Date.now();
    console.log(this);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
