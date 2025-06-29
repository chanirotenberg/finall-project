import {
  getAllBookingsService,
  getBookingByIdService,
  createBookingService,
  getUnavailableDatesForHallService,
  getBookingsByUserIdService,
  updateBookingService,
  getUserBookingsDetailsService
  // deleteBookingService
} from '../services/bookingService.js';

import {
  sendBookingConfirmation,
  sendOwnerNotification
} from '../services/emailService.js';

import {
  cancelBookingAndHandleRefund
} from '../services/paymentService.js';

export const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const result = await cancelBookingAndHandleRefund(bookingId);
    res.json({ message: "ההזמנה בוטלה", ...result });
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookingsService();
    res.json(bookings);
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

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await getBookingsByUserIdService(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

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



export const getUserBookingsWithDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await getUserBookingsDetailsService(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
