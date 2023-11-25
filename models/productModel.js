/* eslint-disable*/
const mongoose = require('mongoose');

const producSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      maxLength: [50, 'A product name cannot be more than 50 characters'],
      minLength: [3, 'A product name must be at least 3 characters']
    },
    price:{
      type: Number,
      required: [true, 'A product must have a name'],
      min: [1, 'A product price must be at least 1'],
    },
    image:{
      type: String,
      required: [true, 'A product must have an image'],
    },
    type:{
      type: String,
      required: [true, 'A product must have a type'],
      enum:{
        values :['Desayuno', 'Almuerzo', 'Cena'],
        message:'Type must be either dasayuno, almuerzo or cena'
      }
    },
    description:{
      type: String,
      trim: true,
    },
    dateEntry:{
      type: Date,
      default: Date.now,
      select: false
    }
  });
  
  const Product = mongoose.model('product', producSchema);

  module.exports = Product;