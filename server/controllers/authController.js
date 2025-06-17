import {
  registerUserService,
  loginUserService,
  resetUserPasswordService
} from '../services/authService.js';

import jwt from 'jsonwebtoken';
import { sendForgotPasswordEmail } from '../services/emailService.js';
import getDb from '../services/dbService.js';

const jwtSecret = process.env.JWT_SECRET || 'mysecret';
const pool = getDb();

export const registerUser = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(400).json({ error: 'כתובת האימייל כבר קיימת' });
    }
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { token, user } = await loginUserService(req.body);
    res.json({ token, user });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: "שם משתמש או סיסמה שגויים" });
    }
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });

    const resetLink = `http://localhost:5173/reset-password?email=${encodeURIComponent(email)}`;
    await sendForgotPasswordEmail(email, resetLink);
    res.json({ message: 'קישור לשחזור סיסמה נשלח למייל שלך.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const success = await resetUserPasswordService(email, newPassword);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'הסיסמה שונתה בהצלחה' });
  } catch (err) {
    next(err);
  }
};
