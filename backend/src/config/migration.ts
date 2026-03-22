// src/config/migration.ts
import pool from './database';

async function migrate(): Promise<void> {
  try {
    console.log('🔄 Running migration: Creating team_invitations table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS team_invitations (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL REFERENCES users(id),
        employee_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP,
        UNIQUE(admin_id, employee_id)
      );
    `);

    console.log('✅ team_invitations table created successfully');
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
