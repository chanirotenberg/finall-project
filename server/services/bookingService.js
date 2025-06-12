import getDb from './dbService.js';

const pool = getDb();

export const getAllBookingsService = async () => {
  const [rows] = await pool.query('SELECT * FROM bookings');
  return rows;
};

export const getBookingByIdService = async (id) => {
  const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return rows[0];
};

export const createBookingService = async (bookingData) => {
  const {
    user_id,
    hall_id,
    event_date,
    status = 'pending',
    payment = 0.00,
    cancellation_fee = 0.00
  } = bookingData;

  const [result] = await pool.query(
    'INSERT INTO bookings (user_id, hall_id, event_date, status, payment, cancellation_fee) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, hall_id, event_date, status, payment, cancellation_fee]
  );

  return { id: result.insertId, ...bookingData };
};

export const updateBookingService = async (id, bookingData) => {
  const {
    user_id,
    hall_id,
    event_date,
    status,
    payment,
    cancellation_fee
  } = bookingData;

  const [result] = await pool.query(
    'UPDATE bookings SET user_id = ?, hall_id = ?, event_date = ?, status = ?, payment = ?, cancellation_fee = ? WHERE id = ?',
    [user_id, hall_id, event_date, status, payment, cancellation_fee, id]
  );

  if (result.affectedRows === 0) return null;
  return getBookingByIdService(id);
};

export const deleteBookingService = async (id) => {
  const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getBookingsByUserIdService = async (userId) => {
  const [rows] = await pool.query(
    `SELECT b.*, h.name as hall_name
     FROM bookings b
     JOIN halls h ON b.hall_id = h.id
     WHERE b.user_id = ?`,
    [userId]
  );
  return rows;
};

// services/bookingService.js
export const getUnavailableDatesForHallService = async (hallId) => {
  const [rows] = await pool.query(
    `SELECT event_date FROM bookings 
     WHERE hall_id = ? AND status != 'canceled'`,
    [hallId]
  );
  return rows.map(r => r.event_date);
};


