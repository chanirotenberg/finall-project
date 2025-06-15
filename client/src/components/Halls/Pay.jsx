import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PayPalButton from '../../components/PayPalButton';
import ApiService from '../../services/ApiService';

const Pay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  const [bookingId, setBookingId] = useState(null);

  // יוצרים את ההזמנה פעם אחת בתחילת המסך
  useEffect(() => {
    const createBooking = async () => {
      try {
        const res = await ApiService.request({
          method: 'POST',
          url: 'http://localhost:3000/bookings/new',
          body: bookingData,
        });

        if (!res.id) throw new Error("No insertId returned");
        setBookingId(res.id);
      } catch (err) {
        console.error("שגיאה ביצירת ההזמנה:", err);
        alert("אירעה שגיאה ביצירת ההזמנה. נסה שוב.");
        navigate('/');
      }
    };

    if (bookingData) {
      createBooking();
    } else {
      alert("אין נתוני הזמנה זמינים");
      navigate('/');
    }
  }, [bookingData, navigate]);

  const handlePaymentSuccess = async (captureId) => {
    try {
      await ApiService.request({
        method: 'POST',
        url: `http://localhost:3000/payment/capture-order`,
        body: {
          orderID: captureId,
          bookingId: bookingId
        }
      });

      alert("התשלום וההזמנה הושלמו בהצלחה!");
      localStorage.removeItem("bookingData");
      navigate("/success");
    } catch (err) {
      console.error("שגיאה בעת אישור התשלום:", err);
      alert("התשלום בוצע אך לא נשמרה ההזמנה.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>תשלום עבור הזמנה</h2>
      <p>סכום לתשלום: ₪{bookingData?.payment}</p>
      {bookingId && (
        <PayPalButton
          amount={bookingData?.payment}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Pay;
