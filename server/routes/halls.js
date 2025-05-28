import express from 'express';
import {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  getHallCalendar
} from '../controllers/hallController.js';

const router = express.Router();

router.get('/', getAllHalls);
router.get('/:id', getHallById);
router.post('/', createHall);
router.put('/:id', updateHall);
router.delete('/:id', deleteHall);
router.get('/:id/calendar', getHallCalendar); // לוח התאריכים

export default router;
