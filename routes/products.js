// routes/products.js
// Handles product listing, details, and admin CRUD operations.

const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const { isAdmin } = require('../middlewares/authMiddleware');

// Get all products (public)
router.get('/', (req, res) => {
  productModel.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(results);
  });
});

// Get product details by ID (public)
router.get('/:id', (req, res) => {
  productModel.getProductById(req.params.id, (err, product) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  });
});

// Admin: Add new product
router.post('/', isAdmin, (req, res) => {
  const { name, description, price, image_url } = req.body;
  if (!name || !description || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  productModel.addProduct({ name, description, price, image_url }, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.status(201).json({ message: 'Product added', productId: result.insertId });
  });
});

// Admin: Update product
router.put('/:id', isAdmin, (req, res) => {
  const { name, description, price, image_url } = req.body;
  productModel.updateProduct(req.params.id, { name, description, price, image_url }, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Product updated' });
  });
});

// Admin: Delete product
router.delete('/:id', isAdmin, (req, res) => {
  productModel.deleteProduct(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Product deleted' });
  });
});

module.exports = router; 