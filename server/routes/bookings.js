import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createBooking,
  // cancelBooking,
  getMyBookings,
  getUnavailableDatesForHall,
  getUserBookingsWithDetails
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/unavailable/:hallId', getUnavailableDatesForHall);
router.post('/new', createBooking);
// router.post('/cancel/:id', cancelBooking);

router.use(authenticate);
router.get('/me/details', getUserBookingsWithDetails);
// router.get('/me', getMyBookings);



export default router;
