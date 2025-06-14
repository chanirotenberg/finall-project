import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PayPalButton from '../../components/PayPalButton';
import ApiService from '../../services/ApiService';

const Pay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  const handlePaymentSuccess = async () => {
    try {
      await ApiService.request({
        method: 'POST',
        url: '/booking',
        body: bookingData,
      });
      alert('התשלום וההזמנה הושלמו בהצלחה!');
      localStorage.removeItem('bookingData');
      navigate('/success');
    } catch (err) {
      alert('אירעה שגיאה בשמירת ההזמנה.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>תשלום עבור הזמנה</h2>
      <p>סכום לתשלום: ₪{bookingData?.payment}</p>
      <PayPalButton amount={bookingData?.payment || 0} onSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default Pay;
