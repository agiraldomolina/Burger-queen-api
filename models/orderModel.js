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

orderSchema.pre('save', async function (next) {
// Only run when status is modified
  if (!this.isModified('status') || this.isNew) return next();

  if (this.isModified('status') && (this.status === 'delivered')) {
    this.dateProcessed = Date.now();
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
