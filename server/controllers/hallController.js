import { getHallsWithAverageRatingsService } from '../services/hallService.js';

export const getHallsWithRatings = async (req, res, next) => {
  try {
    const { category } = req.query;
    const halls = await getHallsWithAverageRatingsService(category);
    res.json(halls);
  } catch (err) {
    next(err);
  }
};
