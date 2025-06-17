import fetch from "node-fetch";
import getDb from "./dbService.js";
import {
  sendReviewRequest,
  sendOwnerNotification,
  sendBookingConfirmation
} from "./emailService.js";
import { getBookingByIdService } from "./bookingService.js";

const PAYPAL_CLIENT_ID = "Ad48sRiZatN40R4PaZkSj_UBvpGHdBjcdAOy46XEuSrgCh8KSoL24eVmjMdwCcAvc86KJOx1Hn4O0CSe";
const PAYPAL_SECRET = "EIk0q8EyGOY1nzis7KjfR3TSNYH3UL9qS1ZfzCXPj-u9UEvQLiRP62A9D_1k_ZoqBlQLAS5nbQH31wWg";
const BASE_URL = "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  if (!response.ok) throw new Error("Failed to get PayPal token");
  return data.access_token;
};

export const createOrderService = async (amount) => {
  const accessToken = await getAccessToken();
  const validAmount = parseFloat(amount).toFixed(2);
  if (isNaN(validAmount)) throw new Error("Invalid amount");

  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "ILS", value: validAmount } }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error("Failed to create order");
  return data;
};

export const captureOrderService = async (orderID, bookingId) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error("Failed to capture order");

  const captureId = data?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
  if (!captureId) throw new Error("No capture ID found");

  const booking = await getBookingByIdService(bookingId);

  if (!booking.paypal_capture_id) {
    await saveCaptureIdToDb(bookingId, captureId);

    // שליחת מיילים – רק אם לא נשלחו קודם
    await sendBookingConfirmation(booking.user_email,booking);
    await sendOwnerNotification(booking.hall_owner_email, booking.user_name, booking.event_date, booking.hall_name);
  }

  return data;
};

export const saveCaptureIdToDb = async (bookingId, captureId) => {
  const db = getDb();
  await db.query(
    "UPDATE bookings SET paypal_capture_id = ? WHERE id = ?",
    [captureId, bookingId]
  );
};

export const refundCaptureService = async (captureId, amount) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${BASE_URL}/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: {
        value: parseFloat(amount).toFixed(2),
        currency_code: "ILS"
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Refund PayPal Error Details:", JSON.stringify(data, null, 2));
    throw new Error("Failed to refund");
  }

  return data;
};

export const cancelBookingAndHandleRefund = async (bookingId) => {
  const db = getDb();
  const [rows] = await db.query(
    "SELECT event_date, payment, status, paypal_capture_id FROM bookings WHERE id = ?",
    [bookingId]
  );
  const booking = rows[0];
  if (!booking) throw new Error("הזמנה לא נמצאה");
  if (booking.status === "canceled") throw new Error("ההזמנה כבר בוטלה");

  const daysDiff = Math.ceil(
    (new Date(booking.event_date) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const payment = Number(booking.payment);

  let cancellationFee = 0;
  let refund = 0;

  if (daysDiff > 14) {
    cancellationFee = 0;
    refund = payment;
  } else if (daysDiff >= 7) {
    cancellationFee = payment * 0.3;
    refund = payment - cancellationFee;
  } else {
    cancellationFee = payment;
    refund = 0;
  }

  if (refund > 0 && booking.paypal_capture_id) {
    console.log("Refunding", refund, "ILS for capture ID", booking.paypal_capture_id);
    await refundCaptureService(booking.paypal_capture_id, refund);
  }

  await db.query(
    "UPDATE bookings SET status = 'canceled', cancellation_fee = ? WHERE id = ?",
    [cancellationFee, bookingId]
  );

  return { refund, cancellationFee };
};
