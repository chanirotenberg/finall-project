// controllers/paymentController.js
import { createOrderService, captureOrderService } from "../services/paymentService.js";

export const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Missing amount" });

    const order = await createOrderService(amount);
    console.log("PayPal order created:", order); // הוסף שורה זו

    res.json({ id: order.id });
  } catch (err) {
    console.error("Error in createOrder:", err); // הוסף שורה זו
    next(err);
  }
};



export const captureOrder = async (req, res, next) => {
  try {
    const { orderID } = req.body;

    if (!orderID) return res.status(400).json({ error: "Missing order ID" });

    const capture = await captureOrderService(orderID);
    res.json(capture); // נחזיר מידע מלא על העסקה
  } catch (err) {
    next(err);
  }
};
