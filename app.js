// Import required modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// Import route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Set up MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Make db accessible via req.db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use route files
app.use('/auth', authRoutes); // Authentication routes
app.use('/products', productRoutes); // Product catalog and admin CRUD
app.use('/cart', cartRoutes); // Cart operations
app.use('/orders', orderRoutes); // Order placement and history

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler (should be last)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*
  Detailed Comments:
  - This file sets up the Express server, connects to MySQL, and configures middleware for sessions, body parsing, and static files.
  - Environment variables are loaded from .env for security and flexibility.
  - The MySQL connection pool is attached to each request for easy DB access in routes/controllers.
  - The server listens on port 3000 by default.
*/ 