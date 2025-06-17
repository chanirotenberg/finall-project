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
    guests = 0,
    catering = [], // ✅ מערך מנות קייטרינג
    total_catering_price = 0.00
  } = bookingData;

  // 1. הכנסת ההזמנה לטבלת bookings (בלי שדות first/second/third)
  const [result] = await pool.query(
    `INSERT INTO bookings (
      user_id, hall_id, event_date, status, payment, cancellation_fee,
      guests, total_catering_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id, hall_id, event_date, status, payment, cancellation_fee,
      guests, total_catering_price
    ]
  );

  const bookingId = result.insertId;

  // 2. הכנסת מנות קייטרינג לטבלת הקישור
  if (Array.isArray(catering)) {
    for (const dish of catering) {
      await pool.query(
        `INSERT INTO booking_catering_options (booking_id, catering_option_id) VALUES (?, ?)`,
        [bookingId, dish.id]
      );
    }
  }

  // 3. החזרת ההזמנה עם פרטים מלאים
  return getBookingByIdService(bookingId);
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


export const getUserBookingsDetailsService = async (userId) => {
  console.log("🔥 getUserBookingsDetailsService הופעלה");
  const [rows] = await pool.query(`
    SELECT 
      b.id AS booking_id,
      b.event_date,
      b.status,
      b.guests,
      b.payment,
      b.total_catering_price,
      h.name AS hall_name,
      h.location,
      h.price AS hall_price,
      co.id AS catering_id,
      co.option_name,
      co.course_type
    FROM bookings b
    JOIN halls h ON b.hall_id = h.id
    LEFT JOIN booking_catering_options bco ON b.id = bco.booking_id
    LEFT JOIN catering_options co ON bco.catering_option_id = co.id
    WHERE b.user_id = ?
    ORDER BY b.event_date DESC
  `, [userId]);
  console.log("✅ rows:", rows);
  const bookingsMap = {};

  for (const row of rows) {
    console.log(">>> שורה מהדאטה:", row);

    if (!bookingsMap[row.booking_id]) {
      bookingsMap[row.booking_id] = {
        id: row.booking_id,
        event_date: row.event_date,
        status: row.status,
        guests: row.guests,
        payment: row.payment,
        total_catering_price: row.total_catering_price,
        hall: {
          name: row.hall_name,
          location: row.location,
          price: row.hall_price,
        },
        catering: [],
      };
    }

    if (row.catering_id !== null) {
      bookingsMap[row.booking_id].catering.push({
        id: row.catering_id,
        name: row.option_name,
        type: row.course_type,
      });
    }
  }


  return Object.values(bookingsMap);
};

