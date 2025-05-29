import {
  getAllReviewsService,
  getReviewByHallIdService,
  createReviewService,
  updateReviewService,
  deleteReviewService
} from '../services/reviewService.js';

export const getAllReviews = async (req, res, next) => {
  try {
    const { hall_id } = req.query;
    const reviews = await getAllReviewsService(hall_id);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};


export const getReviewByHallId = async (req, res, next) => {
  try {
    const review = await getReviewByHallIdService(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    console.log(review)
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const newReview = await createReviewService(req.body);
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const updatedReview = await updateReviewService(req.params.id, req.body);
    if (!updatedReview) return res.status(404).json({ error: 'Review not found' });
    res.json(updatedReview);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const success = await deleteReviewService(req.params.id);
    if (!success) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};
