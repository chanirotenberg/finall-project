import getDb from './dbService.js';

const pool = getDb();

export const getAllReviewsService = async () => {
  const [rows] = await pool.query('SELECT * FROM reviews');
  return rows;
};

export const getReviewByIdService = async (id) => {
  const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
  return rows[0];
};

export const createReviewService = async (reviewData) => {
  const {
    user_id,
    hall_id,
    rating,
    comment,
    discount_given = false
  } = reviewData;

  const [result] = await pool.query(
    'INSERT INTO reviews (user_id, hall_id, rating, comment, discount_given) VALUES (?, ?, ?, ?, ?)',
    [user_id, hall_id, rating, comment, discount_given]
  );

  return { id: result.insertId, ...reviewData };
};

export const updateReviewService = async (id, reviewData) => {
  const {
    user_id,
    hall_id,
    rating,
    comment,
    discount_given
  } = reviewData;

  const [result] = await pool.query(
    'UPDATE reviews SET user_id = ?, hall_id = ?, rating = ?, comment = ?, discount_given = ? WHERE id = ?',
    [user_id, hall_id, rating, comment, discount_given, id]
  );

  if (result.affectedRows === 0) return null;
  return getReviewByIdService(id);
};

export const deleteReviewService = async (id) => {
  const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
