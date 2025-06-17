// services/reviewCron.js
import cron from 'node-cron';
import getDb from './dbService.js';
import { sendReviewRequest } from './emailService.js';
import logger from '../utils/logger.js';

const startReviewReminderCron = () => {
  cron.schedule('0 8 * * *', async () => {
    const db = getDb();
    try {
      const [rows] = await db.query(`
  SELECT b.hall_id, b.event_date, u.email AS user_email, h.name AS hall_name
  FROM bookings b
  JOIN users u ON b.user_id = u.id
  JOIN halls h ON b.hall_id = h.id
  WHERE b.status = 'confirmed' 
          AND DATE(b.event_date) = CURDATE() - INTERVAL 1 DAY
`);


      for (const booking of rows) {
        const reviewLink = `http://localhost:5173/review/add/${booking.hall_id}`;
        await sendReviewRequest(booking.user_email, booking.hall_name, reviewLink);
      }

      logger.info(`✅ Sent ${rows.length} review reminder emails.`);
    } catch (err) {
      logger.error("❌ Error in review reminder cron job:", err);
    }
  });
};

export default startReviewReminderCron;
