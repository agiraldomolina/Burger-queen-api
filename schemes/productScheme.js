/* eslint-disable*/
const mongoose = require('mongoose');

const producSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true
    },
    price:{
      type: Number,
      required: [true, 'A product must have a name'],
    },
    image:{
      type: String,
      required: [true, 'A product must have an image'],
    },
    type:{
      type: String,
      required: [true, 'A product must have a type'],
    },
    dateEntry:{
      type: Date,
      default: Date.now,
      select: false
    }
  });
  
  const Product = mongoose.model('product', producSchema);

  module.exports = Product;