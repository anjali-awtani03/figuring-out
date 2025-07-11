// routes/orders.js
// Handles order placement and retrieval (user and admin).

const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Place a new order (user)
router.post('/place', isAuthenticated, (req, res) => {
  const { items, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0 || !total) {
    return res.status(400).json({ message: 'Order items and total required' });
  }
  const order = {
    user_id: req.session.user.id,
    total,
    items,
  };
  orderModel.placeOrder(order, (err, result) => {
    if (err) return res.status(500).json({ message: 'Order placement failed' });
    res.status(201).json({ message: 'Order placed', orderId: result.orderId });
  });
});

// Get all orders for the logged-in user
router.get('/my', isAuthenticated, (req, res) => {
  orderModel.getOrdersByUser(req.session.user.id, (err, orders) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(orders);
  });
});

// Admin: Get all orders
router.get('/all', isAdmin, (req, res) => {
  orderModel.getAllOrders((err, orders) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(orders);
  });
});

module.exports = router; 