import {
  getHallsByOwnerIdService,
  updateOwnerHallService,
  getHallsWithCateringByOwnerService,
  updateHallCateringService,
  getBookingsForOwnerService,
  addDiscountService,
  cancelBookingByOwnerService
} from '../services/ownerService.js';

export const cancelBookingByOwner = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const ownerId = req.user.id;

    await cancelBookingByOwnerService(bookingId, ownerId);
    res.json({ message: "ההזמנה בוטלה ונשלח מייל ללקוח" });
  } catch (err) {
    console.error("❌ Owner Cancel Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const getOwnerHalls = async (req, res, next) => {
  try {
    const halls = await getHallsByOwnerIdService(req.user.id);
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

export const updateOwnerHall = async (req, res, next) => {
  try {
    const {
      name, description, image, location,
      price, capacity, category, about
    } = req.body;

    const success = await updateOwnerHallService(
      req.params.id,
      req.user.id,
      { name, description, image, location, price, capacity, category, about }
    );

    if (!success)
      return res.status(403).json({ error: "Unauthorized or not found" });

    res.json({ message: "Hall updated successfully" });
  } catch (err) {
    console.error("❌ Update Hall Error:", err);
    next(err);
  }
};

export const getHallsWithCatering = async (req, res, next) => {
  try {
    const halls = await getHallsWithCateringByOwnerService(req.user.id);
    res.json(halls);
  } catch (err) {
    next(err);
  }
};

export const updateOwnerCatering = async (req, res, next) => {
  try {
    await updateHallCateringService(req.params.id, req.user.id, req.body.catering);
    res.json({ message: 'Catering updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const getBookingsForOwnerHalls = async (req, res, next) => {
  try {
    const bookings = await getBookingsForOwnerService(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const addOwnerDiscount = async (req, res, next) => {
  try {
    const { hall_id, date, discount } = req.body;
    await addDiscountService(hall_id, date, discount, req.user.id);
    res.json({ message: 'Discount added successfully' });
  } catch (err) {
    next(err);
  }
};
