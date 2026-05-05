import cron from 'node-cron';
import pool from '../config/database';

export const startTaskCron = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🔄 Running cron job: Checking for overdue tasks...');
      
      const query = `
        UPDATE tasks 
        SET is_overdue = true 
        WHERE status NOT IN ('completed', 'failed') 
        AND due_date < NOW() 
        AND is_overdue = false
        RETURNING id;
      `;
      
      const result = await pool.query(query);
      if (result.rowCount && result.rowCount > 0) {
        console.log(`✅ Marked ${result.rowCount} tasks as overdue.`);
      } else {
        console.log('✅ No new overdue tasks found.');
      }
    } catch (error) {
      console.error('❌ Error in overdue task cron job:', error);
    }
  });

  console.log('✅ Task cron job scheduled (runs every hour).');
};
