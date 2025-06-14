import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllHalls,
  approveHall,
  getPendingHalls,
  getAllBookings,
  updateBookingStatus
} from '../controllers/adminController.js';

import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get("/halls", getAllHalls);
router.patch("/halls/:id/approve", approveHall);
router.get("/halls/pending", getPendingHalls);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id', updateBookingStatus);

export default router;
