import getDb from './dbService.js';

const pool = getDb();

export const getHallsWithAverageRatingsService = async (category) => {
  let query = `
    SELECT 
      h.*, 
      IFNULL(AVG(r.rating), 0) AS avg_rating
    FROM halls h
    LEFT JOIN reviews r ON h.id = r.hall_id
  `;
  const params = [];

  if (category) {
    query += ` WHERE h.category = ?`;
    params.push(category);
  }

  query += ` GROUP BY h.id`;

  const [rows] = await pool.query(query, params);
  return rows;
};
