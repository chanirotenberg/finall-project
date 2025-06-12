import { getCateringOptionsService, createCateringOrderService } from '../services/cateringService.js';

// controllers/cateringController.js
export const getCateringOptions = async (req, res, next) => {
  try {
    const options = await getCateringOptionsService(req.params.hallId);
    res.json(options);
  } catch (err) {
    next(err);  // ידפיס 500 אם יש בעיה
  }
};

export const createCateringOrder = async (req, res, next) => {
  try {
    const { hallId, userId, selectedCourses } = req.body;
    const order = await createCateringOrderService(hallId, userId, selectedCourses);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};
