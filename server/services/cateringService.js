import getDb from './dbService.js';

const pool = getDb();

export const getCateringOptionsService = async (hallId) => {
  const [rows] = await pool.query(
    'SELECT * FROM catering_options WHERE hall_id = ?', [hallId]
  );
  return rows;
};

export const createCateringOrderService = async (hallId, userId, selectedCourses) => {
  const { first, second, third } = selectedCourses;

  const [rows] = await pool.query(
    'INSERT INTO catering_orders (hall_id, user_id, first_course_id, second_course_id, third_course_id) VALUES (?, ?, ?, ?, ?)',
    [
      hallId,
      userId,
      first,
      second,
      third
    ]
  );
  return { id: rows.insertId, ...selectedCourses };
};
