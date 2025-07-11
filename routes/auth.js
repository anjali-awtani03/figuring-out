// routes/auth.js
// Handles authentication routes: register, login, logout.

const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

// Register route
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  userModel.findUserByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (user) return res.status(409).json({ message: 'Email already registered' });
    userModel.registerUser(username, email, password, (err, result) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  userModel.findUserByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords' });
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      // Store user info in session (excluding password)
      req.session.user = { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin };
      res.json({ message: 'Login successful' });
    });
  });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router; 