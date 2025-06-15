import getDb from './dbService.js';
const pool = getDb();

// מביא את כל ההזמנות (למנהל)
export const getAllBookingsService = async () => {
  const [rows] = await pool.query(`
    SELECT 
      b.*, 
      u.name AS user_name, 
      h.name AS hall_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN halls h ON b.hall_id = h.id
  `);
  return rows;
};

// מביא הזמנה לפי מזהה
export const getBookingByIdService = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      b.*, 
      u.name AS user_name,
      u.email AS user_email,
      h.name AS hall_name,
      o.email AS hall_owner_email
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     JOIN halls h ON b.hall_id = h.id
     LEFT JOIN users o ON h.owner_id = o.id
     WHERE b.id = ?`,
    [id]
  );
  return rows[0];
};

// מביא את כל ההזמנות של משתמש מסוים
export const getBookingsByUserIdService = async (userId) => {
  const [rows] = await pool.query(`
    SELECT b.*, h.name as hall_name
    FROM bookings b
    JOIN halls h ON b.hall_id = h.id
    WHERE b.user_id = ?
  `, [userId]);

  return rows;
};

// יצירת הזמנה חדשה
export const createBookingService = async (bookingData) => {
  const {
    user_id,
    hall_id,
    event_date,
    status = 'confirmed',
    payment = 0.00,
    cancellation_fee = 0.00,
    guests = 0, // ✅ חדש
    first_course_id = null,
    second_course_id = null,
    third_course_id = null,
    total_catering_price = 0.00
  } = bookingData;

  const [result] = await pool.query(
    `INSERT INTO bookings (
      user_id, hall_id, event_date, status, payment, cancellation_fee,
      guests, -- ✅ חדש
      first_course_id, second_course_id, third_course_id, total_catering_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id, hall_id, event_date, status, payment, cancellation_fee,
      guests, // ✅ חדש
      first_course_id, second_course_id, third_course_id, total_catering_price
    ]
  );

  return getBookingByIdService(result.insertId);
};


// מביא את התאריכים התפוסים לאולם מסוים
export const getUnavailableDatesForHallService = async (hallId) => {
  const [rows] = await pool.query(
    `SELECT event_date FROM bookings WHERE hall_id = ? AND status = 'confirmed'`,
    [hallId]
  );
  return rows.map(row => row.event_date);
};

// עדכון סטטוס להזמנה
export const updateBookingStatusService = async (id, newStatus) => {
  await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [newStatus, id]);
};
export const updateBookingService = async (id, bookingData) => {
  const {
    user_id,
    hall_id,
    event_date,
    status,
    payment,
    cancellation_fee,
    first_course_id,
    second_course_id,
    third_course_id,
    total_catering_price
  } = bookingData;

  const [result] = await pool.query(
    `UPDATE bookings SET 
      user_id = ?, hall_id = ?, event_date = ?, status = ?, payment = ?, cancellation_fee = ?,
      first_course_id = ?, second_course_id = ?, third_course_id = ?, total_catering_price = ?
     WHERE id = ?`,
    [
      user_id, hall_id, event_date, status, payment, cancellation_fee,
      first_course_id, second_course_id, third_course_id, total_catering_price,
      id
    ]
  );

  if (result.affectedRows === 0) return null;
  return getBookingByIdService(id);
};

