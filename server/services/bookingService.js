import getDb from './dbService.js';
const db = getDb();

// מביא את כל ההזמנות (למנהל)
export const getAllBookingsService = async () => {
  const [rows] = await db.query(`SELECT * FROM bookings`);
  return rows;
};

// מביא הזמנה לפי מזהה
export const getBookingByIdService = async (id) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
  return rows[0];
};

// מביא את כל ההזמנות של משתמש מסוים
export const getBookingsByUserIdService = async (userId) => {
  const [rows] = await db.query(`
    SELECT b.*, h.name as hall_name
    FROM bookings b
    JOIN halls h ON b.hall_id = h.id
    WHERE b.user_id = ?
  `, [userId]);

  return rows;
};

// יצירת הזמנה חדשה
export const createBookingService = async (data) => {
  const {
    user_id, hall_id, event_date, status = "confirmed",
    payment = 0, cancellation_fee = 0,
    first_course_id, second_course_id, third_course_id,
    total_catering_price = 0, paypal_capture_id = null
  } = data;

  const [result] = await db.query(
    `INSERT INTO bookings (
      user_id, hall_id, event_date, status, payment, cancellation_fee,
      first_course_id, second_course_id, third_course_id, total_catering_price,
      paypal_capture_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, hall_id, event_date, status, payment, cancellation_fee,
     first_course_id, second_course_id, third_course_id, total_catering_price, paypal_capture_id]
  );
console.log("Insert Result:", result);
  return { id: result.insertId, ...data };
};

// מביא את התאריכים התפוסים לאולם מסוים
export const getUnavailableDatesForHallService = async (hallId) => {
  const [rows] = await db.query(
    `SELECT event_date FROM bookings WHERE hall_id = ? AND status = 'confirmed'`,
    [hallId]
  );
  return rows.map(row => row.event_date);
};

// עדכון סטטוס להזמנה
export const updateBookingStatusService = async (bookingId, newStatus) => {
  const [result] = await db.query(
    `UPDATE bookings SET status = ? WHERE id = ?`,
    [newStatus, bookingId]
  );
  return result.affectedRows > 0;
};
