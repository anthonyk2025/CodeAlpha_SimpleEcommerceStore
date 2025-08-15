// backend/models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Link to the user who created the product (the admin)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    // The correct field name is 'countInStock'
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    // The badge is an optional field
    badge: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;