import express from 'express';
import {
  getAllReviews,
  getReviewByHallId,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', getReviewByHallId);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
