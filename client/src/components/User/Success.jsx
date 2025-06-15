import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎉 ההזמנה בוצעה בהצלחה!</h2>
      <p>תודה שהזמנת אולם דרך האתר שלנו.</p>
      <Link to="/my-bookings">
        <button style={{ marginTop: '1rem' }}>לצפייה בהזמנות</button>
      </Link>
    </div>
  );
};

export default Success;
