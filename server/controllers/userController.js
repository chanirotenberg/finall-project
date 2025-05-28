import {
  getUserByIdService,
  updateUserService,
  deleteUserService
} from '../services/userService.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.user.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteMyAccount = async (req, res, next) => {
  try {
    const success = await deleteUserService(req.user.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
