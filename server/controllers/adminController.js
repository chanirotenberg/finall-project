import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService
} from '../services/userService.js';

import {
  getAllBookingsService,
  updateBookingStatusService
} from "../services/bookingService.js";

import {
  getAllHallsService,
  updateHallService,
  getPendingHallsService,
  getHallByIdService
} from "../services/hallService.js";

// כל ההזמנות
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookingsService();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// עדכון סטטוס הזמנה
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

// כל האולמות שממתינים לאישור
export const getPendingHalls = async (req, res, next) => {
  try {
    const halls = await getPendingHallsService();
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

// כל המשתמשים
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// משתמש לפי ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// יצירת משתמש חדש
export const createUser = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// עדכון משתמש
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// מחיקת משתמש
export const deleteUser = async (req, res, next) => {
  try {
    const success = await deleteUserService(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// קבלת כל האולמות
export const getAllHalls = async (req, res, next) => {
  try {
    const halls = await getAllHallsService(); // בלי category
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

// אישור אולם לפי ID
export const approveHall = async (req, res, next) => {
  const hallId = req.params.id;
  try {
    const existingHall = await getHallByIdService(hallId);
    if (!existingHall) return res.status(404).json({ error: "Hall not found" });

    const updated = await updateHallService(hallId, {
      ...existingHall,
      approved: true
    });

    if (existingHall.owner_id) {
      await updateUserService(existingHall.owner_id, { role: 'owner' });
    }

    res.json({ message: "Hall approved successfully, and owner role updated", updated });
  } catch (err) {
    next(err);
  }
};
