
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  getUnavailableDatesForHall
} from '../controllers/bookingController.js';

const router = express.Router();

// 🟢 תחילה - הקריאה שלא דורשת טוקן
router.get('/unavailable/:hallId', getUnavailableDatesForHall);

// 🔒 לאחר מכן - הפעלת האימות
router.use(authenticate);

// ⛔️ מכאן כל שאר הבקשות דורשות טוקן
router.get('/me', getMyBookings);
// router.get('/', getAllBookings);
// router.get('/:id', getBookingById);
// router.post('/', createBooking);
// router.put('/:id', updateBooking);
// router.delete('/:id', deleteBooking);

export default router;
