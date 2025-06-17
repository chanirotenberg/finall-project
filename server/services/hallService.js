import getDb from './dbService.js';

const pool = getDb();
export const getPendingHallsService = async () => {
  const [rows] = await pool.query("SELECT * FROM halls WHERE approved = false");
  return rows;
};


// services/hallService.js
export const getAllHallsService = async (category) => {
  let query = `
    SELECT halls.*, users.name AS owner_name
    FROM halls
    LEFT JOIN users ON halls.owner_id = users.id
  `;
  const params = [];

  if (category) {
    query += " WHERE halls.category = ?";
    params.push(category);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};



export const getHallByIdService = async (id) => {
  const [rows] = await pool.query('SELECT * FROM halls WHERE id = ?', [id]);
  return rows[0];
};

export const createHallService = async (hallData) => {
  const {
    name,
    location,
    price,
    capacity,
    description,
    category,
    approved = false,
    owner_id // ← זה חשוב
  } = hallData;

  const [result] = await pool.query(
    `INSERT INTO halls (name, location, price, capacity, description, category, approved, owner_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, location, price, capacity, description, category, approved, owner_id]
  );

  return { id: result.insertId, ...hallData };
};



export const updateHallService = async (id, data) => {
  const {
    name,
    location,
    price,
    capacity,
    description,
    category,
    approved
  } = data;

  const [result] = await pool.query(
    `UPDATE halls SET name=?, location=?, price=?, capacity=?, description=?, category=?, approved=? WHERE id=?`,
    [name, location, price, capacity, description, category, approved, id]
  );

  if (result.affectedRows === 0) return null;
  return getHallByIdService(id);
};


export const deleteHallService = async (id) => {
  const [result] = await pool.query('DELETE FROM halls WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getHallCalendarService = async (hallId) => {
  const [rows] = await pool.query(
    'SELECT event_date, status FROM bookings WHERE hall_id = ?',
    [hallId]
  );
  return rows;
};
