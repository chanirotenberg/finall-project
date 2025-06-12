import getDb from './dbService.js';

const pool = getDb();

export const getAllHallsService = async (category) => {
  let query = "SELECT * FROM halls";
  let params = [];

  if (category) {
    query += " WHERE category = ?";
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
    owner_id,
    approved = false
  } = hallData;

  const [result] = await pool.query(
    'INSERT INTO halls (name, location, price, capacity, description, owner_id, approved) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, location, price, capacity, description, owner_id, approved]
  );

  return { id: result.insertId, ...hallData };
};

export const updateHallService = async (id, hallData) => {
  const {
    name,
    location,
    price,
    capacity,
    description,
    owner_id,
    approved
  } = hallData;

  const [result] = await pool.query(
    'UPDATE halls SET name = ?, location = ?, price = ?, capacity = ?, description = ?, owner_id = ?, approved = ? WHERE id = ?',
    [name, location, price, capacity, description, owner_id, approved, id]
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
