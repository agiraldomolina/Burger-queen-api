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
  user: {
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
    path: 'user',
    select: '-__v -_id -id -passwordChangedAt -passwordResetToken -passwordResetExpires'
  })
  next();
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
