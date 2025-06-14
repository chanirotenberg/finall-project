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

export async function updateUserService(id, data) {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }

  if (data.role !== undefined) {
    fields.push('role = ?');
    values.push(data.role);
  }

  if (data.verified !== undefined) {
    fields.push('verified = ?');
    values.push(data.verified);
  }

  if (fields.length === 0) return; // אין מה לעדכן

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  await pool.query(query, values);
}



export const deleteUserService = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
