// client/src/pages/Owner/OwnerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OwnerDashboard.module.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <h2>אזור ניהול בעל אולם</h2>
      <div className={styles.buttons}>
        <button onClick={() => navigate("/owner/bookings")}>הזמנות לאולמות שלי</button>
        {/* <button onClick={() => navigate("/owner/discounts")}>ניהול הנחות לפי תאריך</button> */}
        <button onClick={() => navigate("/owner/manage-halls")}>עדכון פרטי אולמות</button>
        <button onClick={() => navigate("/owner/manage-catering")}>עדכון קייטרינג</button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
