import getDb from './dbService.js';
const pool = getDb();
import { sendEmail } from './emailService.js';

export const cancelBookingByOwnerService = async (bookingId, ownerId) => {
    const [[booking]] = await pool.query(`
    SELECT b.*, u.email, u.name AS user_name, h.owner_id
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN halls h ON b.hall_id = h.id
    WHERE b.id = ?
  `, [bookingId]);

    if (!booking) throw new Error("הזמנה לא נמצאה");
    if (booking.owner_id !== ownerId) throw new Error("אין לך הרשאה לבטל הזמנה זו");
    if (booking.status !== "confirmed") throw new Error("רק הזמנות מאושרות ניתן לבטל");

    const now = new Date();
    const eventDate = new Date(booking.event_date);
    const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 30) throw new Error("ניתן לבטל רק הזמנות חודש מראש");

    await pool.query(`UPDATE bookings SET status = 'canceled' WHERE id = ?`, [bookingId]);

    await sendEmail({
        to: booking.email,
        subject: "הזמנתך בוטלה",
        html: `
      <p>שלום ${booking.user_name},</p>
      <p>אנו מצטערים להודיעך כי בעל האולם ביטל את ההזמנה שלך לאירוע ב-${booking.event_date}.</p>
      <p>לפרטים נוספים ניתן ליצור קשר עם הנהלת המערכת.</p>
    `
    });
};


export const getHallsByOwnerIdService = async (ownerId) => {
    const [rows] = await pool.query(
        `SELECT * FROM halls WHERE owner_id = ?`,
        [ownerId]
    );
    return rows;
};

export const updateOwnerHallService = async (hallId, ownerId, data) => {
    const {
        name,
        description,
        image,
        location,
        price,
        capacity,
        category,
        about
    } = data;

    const [result] = await pool.query(
        `UPDATE halls SET 
      name = ?, description = ?, image = ?, location = ?, price = ?, 
      capacity = ?, category = ?, about = ?
     WHERE id = ? AND owner_id = ?`,
        [
            name,
            description,
            image,
            location,
            price,
            capacity,
            category,
            JSON.stringify(about), // ← חובה להמיר כאן
            hallId,
            ownerId
        ]
    );

    return result.affectedRows > 0;
};



export const getHallsWithCateringByOwnerService = async (ownerId) => {
    const [halls] = await pool.query(
        `SELECT * FROM halls WHERE owner_id = ?`,
        [ownerId]
    );

    for (let hall of halls) {
        const [catering] = await pool.query(
            `SELECT id, option_name, course_type, price FROM catering_options WHERE hall_id = ?`,
            [hall.id]
        );
        hall.catering = catering;
    }

    return halls;
};

export const updateHallCateringService = async (hallId, ownerId, options) => {
    const [result] = await pool.query(
        `SELECT * FROM halls WHERE id = ? AND owner_id = ?`,
        [hallId, ownerId]
    );

    if (result.length === 0) throw new Error('Unauthorized');

    await pool.query(`DELETE FROM catering_options WHERE hall_id = ?`, [hallId]);

    const insertPromises = options.map(opt =>
        pool.query(
            `INSERT INTO catering_options (hall_id, option_name, course_type, price) VALUES (?, ?, ?, ?)`,
            [hallId, opt.option_name, opt.course_type || '', opt.price]
        )
    );

    await Promise.all(insertPromises);
};

export const getBookingsForOwnerService = async (ownerId) => {
    const [rows] = await pool.query(
        `SELECT b.*, h.name AS hall_name, u.name AS user_name
     FROM bookings b
     JOIN halls h ON b.hall_id = h.id
     JOIN users u ON b.user_id = u.id
     WHERE h.owner_id = ?`,
        [ownerId]
    );
    return rows;
};

export const addDiscountService = async (hallId, date, discount, ownerId) => {
    const [check] = await pool.query(
        `SELECT * FROM halls WHERE id = ? AND owner_id = ?`,
        [hallId, ownerId]
    );

    if (check.length === 0) throw new Error('Unauthorized');

    await pool.query(
        `INSERT INTO hall_discounts (hall_id, date, discount_percent)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE discount_percent = VALUES(discount_percent)`,
        [hallId, date, discount]
    );
};
