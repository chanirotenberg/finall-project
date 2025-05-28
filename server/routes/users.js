import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount
} from '../controllers/userController.js';

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.delete('/me', deleteMyAccount);

export default router;
