import getDb from './dbService.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const pool = getDb();

export const getAllUsersService = async () => {
  const [rows] = await pool.query('SELECT id, name, email, role, verified, created_at FROM users');
  return rows;
};

export const getUserByIdService = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role, verified, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const createUserService = async (userData) => {
  const { name, email, password, role = 'user', verified = false } = userData;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, role, verified]
  );
  return { id: result.insertId, name, email, role, verified };
};

export const updateUserService = async (id, userData) => {
  const { name, email, role, verified } = userData;
  const [result] = await pool.query(
    'UPDATE users SET name = ?, email = ?, role = ?, verified = ? WHERE id = ?',
    [name, email, role, verified, id]
  );
  if (result.affectedRows === 0) return null;
  return getUserByIdService(id);
};

export const deleteUserService = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
