/* eslint-disable*/
//const { Double } = require('mongodb');
const mongoose = require('mongoose');

const producSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true
    },
    price:{
      type: Number,
    },
    type:{
      type: String,
      required: [true, 'A product must have a type'],
    },
    dateEntry:{
      type: Date,
      default: Date.now
    }
  });
  
  const Product = mongoose.model('product', producSchema); // model for creating doccuments

  module.exports = Product;