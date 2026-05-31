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
  bio?: string;
  phone?: string;
  designation?: string;
  department?: string;
  linkedin_url?: string;
  avatar_url?: string;
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

  static async updateProfile(userId: number, data: { first_name?: string, bio?: string, phone?: string, designation?: string, department?: string, linkedin_url?: string }): Promise<void> {
    const { first_name, bio, phone, designation, department, linkedin_url } = data;
    
    // Build dynamic query
    const fields = [];
    const values = [];
    let i = 1;

    if (first_name !== undefined) { fields.push(`first_name = $${i++}`); values.push(first_name); }
    if (bio !== undefined) { fields.push(`bio = $${i++}`); values.push(bio); }
    if (phone !== undefined) { fields.push(`phone = $${i++}`); values.push(phone); }
    if (designation !== undefined) { fields.push(`designation = $${i++}`); values.push(designation); }
    if (department !== undefined) { fields.push(`department = $${i++}`); values.push(department); }
    if (linkedin_url !== undefined) { fields.push(`linkedin_url = $${i++}`); values.push(linkedin_url); }

    if (fields.length === 0) return; // Nothing to update

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${i}`;
    
    await pool.query(query, values);
  }

  static async updateAvatar(userId: number, avatarUrl: string): Promise<void> {
    const query = 'UPDATE users SET avatar_url = $1 WHERE id = $2';
    await pool.query(query, [avatarUrl, userId]);
  }
}

export default User;
export type { CreateUserParams, UserRow };
