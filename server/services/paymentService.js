import fetch from "node-fetch";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const BASE_URL = "https://api-m.sandbox.paypal.com";

// 1. קבלת טוקן
const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal token error:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token;
};

// 2. יצירת הזמנה
export const createOrderService = async (amount) => {
  const accessToken = await getAccessToken();

  // ודא שהסכום תקני
  const validAmount = parseFloat(amount).toFixed(2);
  if (isNaN(validAmount)) {
    throw new Error("Invalid amount passed to PayPal order");
  }

  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "ILS",
            value: validAmount,
          },
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal create order error:", data);
    throw new Error("Failed to create PayPal order");
  }

  return data;
};

// 3. לכידת תשלום
export const captureOrderService = async (orderID) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal capture error:", data);
    throw new Error("Failed to capture PayPal order");
  }

  return data;
};
