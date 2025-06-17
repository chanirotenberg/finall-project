import {
  getAllHallsService,
  getHallByIdService,
  createHallService,
  updateHallService,
  deleteHallService,
  getHallCalendarService
} from '../services/hallService.js';

export const getAllHalls = async (req, res, next) => {
  try {
    const { category } = req.query;
    const halls = await getAllHallsService(category);
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

export const getHallById = async (req, res, next) => {
  try {
    const hall = await getHallByIdService(req.params.id);
    if (!hall) return res.status(404).json({ error: 'Hall not found' });
    res.json(hall);
  } catch (err) {
    next(err);
  }
};

export const createHall = async (req, res, next) => {
  try {
    const newHall = await createHallService(req.body);
    res.status(201).json(newHall);
  } catch (err) {
    next(err);
  }
};

export const updateHall = async (req, res, next) => {
  try {
    const updatedHall = await updateHallService(req.params.id, req.body);
    if (!updatedHall) return res.status(404).json({ error: 'Hall not found' });
    res.json(updatedHall);
  } catch (err) {
    next(err);
  }
};

export const deleteHall = async (req, res, next) => {
  try {
    const success = await deleteHallService(req.params.id);
    if (!success) return res.status(404).json({ error: 'Hall not found' });
    res.json({ message: 'Hall deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getHallCalendar = async (req, res, next) => {
  try {
    const calendar = await getHallCalendarService(req.params.id);
    res.json(calendar);
  } catch (err) {
    next(err);
  }
};
