import getDb from './dbService.js';

const pool = getDb();

export const getAllReviewsService = async (hall_id) => {
  let query = 'SELECT * FROM reviews';
  let params = [];

  if (hall_id) {
    query += ' WHERE hall_id = ?';
    params.push(hall_id);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getReviewByHallIdService = async (id) => {
  const [rows] = await pool.query('SELECT * FROM reviews WHERE hall_id = ?', [id]);
  return rows;
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
