import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import ApiService from "../services/ApiService";

const PayPalButton = ({ amount, onSuccess }) => {
  const [error, setError] = useState("");

  const handleCreateOrder = async () => {
    try {
      setError("");
      const res = await ApiService.request({
        url: "http://localhost:3000/payment/create-order",
        method: "POST",
        body: { amount },
      });

      return res.id;
    } catch (err) {
      console.error("Create order error:", err);
      setError("שגיאה ביצירת ההזמנה. נסה שוב.");
      throw err;
    }
  };

  const handleApprove = async (data) => {
    try {
      setError("");
      console.log("✅ אישור תשלום עם orderID:", data.orderID);
      onSuccess(data.orderID);
    } catch (err) {
      console.error("שגיאה באישור התשלום:", err);
      setError("שגיאה בעת אישור התשלום. נסה שוב.");
    }
  };

  return (
    <div>
      <PayPalScriptProvider
        options={{
          "client-id": "Ad48sRiZatN40R4PaZkSj_UBvpGHdBjcdAOy46XEuSrgCh8KSoL24eVmjMdwCcAvc86KJOx1Hn4O0CSe",
          currency: "ILS",
        }}
      >
        <PayPalButtons
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
        />
      </PayPalScriptProvider>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default PayPalButton;
