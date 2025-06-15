import express from "express";
import { createOrder, cancelBooking,captureOrder} from "../controllers/paymentController.js";


const router = express.Router();

router.post("/create-order", createOrder);
router.post("/capture-order", captureOrder);
router.post("/cancel/:id", cancelBooking);

export default router;
