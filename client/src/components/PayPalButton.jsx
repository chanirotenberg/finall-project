import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import ApiService from "../services/ApiService";

const PayPalButton = ({ amount, onSuccess }) => {
  const handleCreateOrder = async () => {
    try {
      const res = await ApiService.request({
        url: "http://localhost:3000/payment/create-order",
        method: "POST",
        body: { amount },
      });

      return res.id; // ⚠️ חובה שתחזיר את ה-id של ההזמנה
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  };

  const handleApprove = async (data) => {
    // אם אתה צריך לעשות משהו נוסף כאן, תוכל לשלוח את ה-data.orderID לשרת
    onSuccess();
  };

  return (
   <PayPalScriptProvider
  options={{
    "client-id":"Ad48sRiZatN40R4PaZkSj_UBvpGHdBjcdAOy46XEuSrgCh8KSoL24eVmjMdwCcAvc86KJOx1Hn4O0CSe",
    currency: "ILS"
  }}
>
  <PayPalButtons
    style={{ layout: "vertical" }}
    createOrder={handleCreateOrder}
    onApprove={handleApprove}
  />
</PayPalScriptProvider>

  );
};
export default PayPalButton;
