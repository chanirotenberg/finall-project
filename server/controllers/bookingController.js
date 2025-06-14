import {
  getAllBookingsService,
  getBookingByIdService,
  createBookingService,
  updateBookingService,
  deleteBookingService,
  getUnavailableDatesForHallService
} from '../services/bookingService.js';

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookingsService();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await getBookingByIdService(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const newBooking = await createBookingService(req.body);
    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await updateBookingService(req.params.id, req.body);
    if (!updatedBooking) return res.status(404).json({ error: 'Booking not found' });
    res.json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const success = await deleteBookingService(req.params.id);
    if (!success) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    next(err);
  }
};

import { getBookingsByUserIdService } from '../services/bookingService.js';

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await getBookingsByUserIdService(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// controllers/bookingController.js
export const getUnavailableDatesForHall = async (req, res, next) => {
  try {
    const hallId = req.params.hallId;
    const dates = await getUnavailableDatesForHallService(hallId);
    res.json(dates);
  } catch (err) {
    next(err);
  }
};

export const createBookingWithCatering = async (req, res) => {
  try {
    const booking = await createBookingService(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking with catering:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

