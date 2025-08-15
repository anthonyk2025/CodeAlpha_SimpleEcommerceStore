// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/productModel.js');

// @desc    Fetch all IN-STOCK products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    // --- THIS IS THE CHANGE ---
    // The filter { countInStock: { $gt: 0 } } ensures only products with stock > 0 are returned.
    const products = await Product.find({ countInStock: { $gt: 0 } });
    
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      // Use 'return' to stop execution after sending a response
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error fetching product by ID: ${error.message}`);
    // Check for invalid ObjectId format
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;