import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css"; // תוסיפי קובץ עיצוב אם תרצי

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>אזור ניהול</h1>
      <p>ברוך הבא לממשק ניהול המערכת</p>

      <div className={styles.section}>
        <button onClick={() => navigate("/admin/halls")}>ניהול אולמות</button>
        <button onClick={() => navigate("/admin/users")}>ניהול משתמשים</button>
        <button onClick={() => navigate("/admin/bookings")}>ניהול הזמנות</button>
        <button onClick={() => navigate("/admin/halls/pending")}>אולמות ממתינים לאישור</button>

        {/* אפשר גם */}
        {/* <button onClick={() => navigate("/admin/reports")}>סטטיסטיקות</button> */}
        {/* <button onClick={() => navigate("/admin/logs")}>יומן מערכת</button> */}
      </div>
    </div>
  );
};

export default AdminPage;
