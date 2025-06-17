// manual-test.js
import getDb from './services/dbService.js';
import { sendReviewRequest } from './services/emailService.js';
import logger from './utils/logger.js';

const run = async () => {
    const db = getDb();

    try {
        const [rows] = await db.query(`
       SELECT b.hall_id, b.event_date, u.email AS user_email, h.name AS hall_name
  FROM bookings b
  JOIN users u ON b.user_id = u.id
  JOIN halls h ON b.hall_id = h.id
  WHERE b.status = 'confirmed' 
        AND DATE(b.event_date) = CURDATE()
    `);

        for (const booking of rows) {
        const reviewLink = `http://localhost:5173/review/add/${booking.hall_id}`;
            await sendReviewRequest(booking.user_email, booking.hall_name, reviewLink);
        }

        logger.info(`✅ שלח ${rows.length} מיילים להזמנת תגובה.`);
    } catch (err) {
        logger.error("❌ שגיאה בהרצת בדיקת שליחת תגובה:", err);
    }
};

run();
