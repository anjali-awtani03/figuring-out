// routes/cart.js
// Handles cart operations: add, get, update, remove items.

const express = require('express');
const router = express.Router();
const cartModel = require('../models/cartModel');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Get all cart items for the logged-in user
router.get('/', isAuthenticated, (req, res) => {
  cartModel.getCartByUser(req.session.user.id, (err, items) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(items);
  });
});

// Add item to cart
router.post('/add', isAuthenticated, (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product and quantity required' });
  }
  cartModel.addToCart(req.session.user.id, product_id, quantity, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Added to cart' });
  });
});

// Update cart item quantity
router.put('/update', isAuthenticated, (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product and quantity required' });
  }
  cartModel.updateCartItem(req.session.user.id, product_id, quantity, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Cart updated' });
  });
});

// Remove item from cart
router.delete('/remove', isAuthenticated, (req, res) => {
  const { product_id } = req.body;
  if (!product_id) {
    return res.status(400).json({ message: 'Product required' });
  }
  cartModel.removeFromCart(req.session.user.id, product_id, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Removed from cart' });
  });
});

module.exports = router; 