import express from 'express';
import {
  getOwnerHalls,
  updateOwnerHall,
  getHallsWithCatering,
  updateOwnerCatering,
  getBookingsForOwnerHalls,
  addOwnerDiscount,
  cancelBookingByOwner 
} from '../controllers/ownerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/halls', getOwnerHalls); // ניהול אולמות + בחירת אולם להנחה
router.put('/halls/:id', updateOwnerHall); // עדכון אולם
router.get('/halls-with-catering', getHallsWithCatering); // הבאת אולמות עם קייטרינג
router.put('/halls/:id/catering', updateOwnerCatering); // עדכון קייטרינג
router.get('/bookings', getBookingsForOwnerHalls); // הזמנות של האולמות
router.post('/discounts', addOwnerDiscount); // הוספת הנחה
router.post('/bookings/:id/cancel', cancelBookingByOwner);


export default router;
