import getDb from './dbService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const pool = getDb();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'mysecret';

export const registerUserService = async ({ name, email, password }) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  return { id: result.insertId, name, email, role: 'user' };
};

export const loginUserService = async ({ email, password }) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: '7h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// איפוס סיסמה
export const resetUserPasswordService = async (email, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, saltRounds);
  const [result] = await pool.query(
    'UPDATE users SET password = ? WHERE email = ?',
    [hashed, email]
  );
  return result.affectedRows > 0;
};