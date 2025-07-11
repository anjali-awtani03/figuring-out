// models/user.js
// User model for the ecommerce app
// Defines the structure and methods for user data

/**
 * User schema:
 * id: INT, primary key, auto-increment
 * name: VARCHAR
 * email: VARCHAR, unique
 * password: VARCHAR (hashed)
 * role: ENUM('customer', 'admin')
 */

// This file will contain functions to interact with the users table in MySQL

// Example function to create a new user
// (Implementation will use req.db from app.js)

// module.exports = {
//   createUser: async (userData) => { ... },
//   findUserByEmail: async (email) => { ... },
//   ...
// }; 