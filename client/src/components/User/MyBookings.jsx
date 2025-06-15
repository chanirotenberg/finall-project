import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await ApiService.request({
          url: `http://localhost:3000/bookings/me`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });

        setBookings(res);
      } catch (err) {
        console.error("שגיאה בטעינת ההזמנות:", err);
      }
    };

    fetchBookings();
  }, []);

  const hasDatePassed = (dateStr) => {
    const today = new Date();
    const eventDate = new Date(dateStr);
    return eventDate < today;
  };

  return (
    <div className={styles.container}>
      <h2>ההזמנות שלי</h2>
      {bookings.length === 0 ? (
        <p>אין הזמנות להצגה.</p>
      ) : (
        <ul className={styles.list}>
          {bookings.map((booking) => (
            <li key={booking.id} className={styles.item}>
              <h3>{booking.hall_name}</h3>
              <p>
                <strong>תאריך האירוע:</strong>{" "}
                {new Date(booking.event_date).toLocaleDateString()}
              </p>
              <p>
                <strong>סטטוס:</strong> {booking.status}
              </p>

              {/* הצגת כפתור רק אם התאריך עבר והסטטוס הוא confirmed */}
              {hasDatePassed(booking.event_date) && booking.status === "confirmed" && (
                <button
                  className={styles.reviewButton}
                  onClick={() => navigate(`/review/add/${booking.hall_id}`)}
                >
                  הוסף תגובה
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
