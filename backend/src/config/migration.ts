// src/config/migration.ts
import pool from './database';

async function migrate(): Promise<void> {
  try {
    console.log('Running migration: Creating team_invitations table...');

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

    console.log('team_invitations table created successfully');

    console.log('Running migration: Adding priority and is_overdue to tasks...');
    await pool.query(`
      ALTER TABLE tasks 
      ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
      ADD COLUMN IF NOT EXISTS is_overdue BOOLEAN DEFAULT false;
    `);
    console.log('tasks table updated successfully');

    console.log('Running migration: Adding profile fields to users...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS designation VARCHAR(100),
      ADD COLUMN IF NOT EXISTS department VARCHAR(100),
      ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);
    `);
    console.log('users table updated successfully');

    console.log('Running migration: Creating task_attachments table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_attachments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        uploaded_by INTEGER NOT NULL REFERENCES users(id),
        file_url VARCHAR(500) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
    `);
    console.log('task_attachments table created successfully');

    console.log('Running migration: Creating notifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        entity_id VARCHAR(50),
        entity_type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);
    `);
    console.log('notifications table created successfully');

    console.log('Running migration: Creating task_comments table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
    `);
    console.log('task_comments table created successfully');

    console.log('Running migration: Creating eom_records table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eom_records (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL REFERENCES users(id),
        employee_id INTEGER NOT NULL REFERENCES users(id),
        month DATE NOT NULL,
        score INTEGER NOT NULL,
        snapshot_stats JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(admin_id, month)
      );
    `);
    console.log('eom_records table created successfully');

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
