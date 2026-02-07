// src/models/userModel.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, firstName, role = 'employee' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, role, created_at
    `;
    
    const values = [email, hashedPassword, firstName, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  static async updateLastLogin(userId) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = User;