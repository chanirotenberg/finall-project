import express from 'express';
import { getHallsWithRatings } from '../controllers/hallController.js';

const router = express.Router();

router.get('/', getHallsWithRatings);

export default router;
