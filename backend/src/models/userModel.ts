// src/models/userModel.ts
import pool from '../config/database';
import bcrypt from 'bcryptjs';

interface CreateUserParams {
  email: string;
  password: string;
  firstName: string;
  role?: 'admin' | 'employee';
}

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  role: 'admin' | 'employee';
  is_active: boolean;
  created_at: Date;
  last_login: Date | null;
}

class User {
  static async create({ email, password, firstName, role = 'employee' }: CreateUserParams): Promise<UserRow> {
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

  static async findByEmail(email: string): Promise<UserRow | undefined> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(userId: number): Promise<void> {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [userId]);
  }
}

export default User;
export type { CreateUserParams, UserRow };
