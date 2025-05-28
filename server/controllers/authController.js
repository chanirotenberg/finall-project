import {
  registerUserService,
  loginUserService
} from '../services/authService.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'mysecret';

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
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { token, user } = await loginUserService(req.body);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};
