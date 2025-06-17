import getDb from './dbService.js';

const pool = getDb();
export const getPendingHallsService = async () => {
  const [rows] = await pool.query("SELECT * FROM halls WHERE approved = false");
  return rows;
};


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
    category,
    approved = false,
    owner_id
  } = hallData;

  // בדיקת קיום אולם עם אותו שם ועיר
  const [existing] = await pool.query(
    "SELECT * FROM halls WHERE name = ? AND location = ?",
    [name, location]
  );

  if (existing.length > 0) {
    const err = new Error("אולם עם שם זה כבר קיים בעיר שנבחרה");
    err.status = 400;
    throw err;
  }

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
