import {
  getAllBookingsService,
  getBookingByIdService,
  createBookingService,

  getUnavailableDatesForHallService,
  getBookingsByUserIdService
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

    // שליחת מייל ללקוח
    const userEmail = req.body.user_email;
    const htmlToUser = `
      <h3>אישור הזמנתך</h3>
      <p>הזמנתך לאולם <strong>${req.body.hall_name}</strong> בתאריך <strong>${req.body.event_date}</strong> התקבלה בהצלחה!</p>
    `;
    await sendBookingConfirmation(userEmail, htmlToUser);

    // שליחת מייל לבעל האולם
    const ownerEmail = req.body.hall_owner_email;
    await sendOwnerNotification(ownerEmail, req.body.user_name, req.body.event_date, req.body.hall_name);

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
