import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService
} from '../services/userService.js';
import { getAllBookingsService, updateBookingStatusService } from "../services/bookingService.js";

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookingsService();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  const bookingId = req.params.id;
  const { status } = req.body;
  try {
    await updateBookingStatusService(bookingId, status);
    res.json({ message: "Booking status updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const getPendingHalls = async (req, res, next) => {
  try {
    const halls = await getPendingHallsService();
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const success = await deleteUserService(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
// controllers/adminController.js
import {
  getAllHallsService,
  updateHallService,
  getPendingHallsService,
  getHallByIdService 
} from "../services/hallService.js";

// מחזיר את כל האולמות - בלי סינון
export const getAllHalls = async (req, res, next) => {
  try {
    const halls = await getAllHallsService(); // בלי category
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

// מאשר אולם לפי ID (מאפס את approved = true)
// adminController.js
export const approveHall = async (req, res, next) => {
  const hallId = req.params.id;
  try {
    // 1. קודם מביאים את האולם הקיים
    const existingHall = await getHallByIdService(hallId);
    if (!existingHall) return res.status(404).json({ error: "Hall not found" });

    // 2. מוסיפים רק approved: true
    const updated = await updateHallService(hallId, {
      ...existingHall,
      approved: true
    });

    // 3. מעדכנים את תפקיד הבעלים של האולם
    if (existingHall.owner_id) {
      await updateUserService(existingHall.owner_id, { role: 'owner' });
    }

    res.json({ message: "Hall approved successfully, and owner role updated", updated });
  } catch (err) {
    next(err);
  }
};



