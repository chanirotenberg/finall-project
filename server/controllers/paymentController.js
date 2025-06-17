import {
  createOrderService,
  captureOrderService,
  saveCaptureIdToDb,
  cancelBookingAndHandleRefund
} from "../services/paymentService.js";

import { getBookingByIdService } from "../services/bookingService.js";

export const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Missing amount" });

    const order = await createOrderService(amount);
    res.json({ id: order.id });
  } catch (err) {
    next(err);
  }
};

export const captureOrder = async (req, res, next) => {
  try {
    const { orderID, bookingId } = req.body;
    if (!orderID || !bookingId) {
      return res.status(400).json({ error: "Missing order ID or booking ID" });
    }

    const capture = await captureOrderService(orderID);
    const captureId = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    if (!captureId) {
      return res.status(500).json({ error: "Failed to extract capture ID" });
    }

    await saveCaptureIdToDb(bookingId, captureId);
    res.json({ success: true, captureId });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingByIdService(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (new Date(booking.event_date) < new Date()) {
      return res.status(400).json({ error: "Cannot cancel past event" });
    }

    const { refund, cancellationFee } = await cancelBookingAndHandleRefund(id);
    res.json({ message: "ההזמנה בוטלה", refund, cancellationFee });
  } catch (err) {
    next(err);
  }
};
