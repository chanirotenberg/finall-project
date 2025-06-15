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

  const handleCancelBooking = async (bookingId) => {
    console.log(bookingId)
    try {
      const response = await ApiService.request({
        method: "POST",
        url: `http://localhost:3000/payment/cancel/${bookingId}`,
      });

      alert(
        `ההזמנה בוטלה.\nקיבלת החזר של ₪${response.refund.toFixed(2)}.\nקנס ביטול: ₪${response.cancellationFee.toFixed(2)}`
      );

      // רענון הרשימה
      const updated = bookings.map(b =>
        b.id === bookingId ? { ...b, status: "canceled" } : b
      );
      setBookings(updated);
    } catch (err) {
      console.error("שגיאה בביטול ההזמנה:", err);
      alert("שגיאה בביטול ההזמנה");
    }
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

              {/* כפתור הוספת תגובה – רק אם עבר תאריך ואישור */}
              {hasDatePassed(booking.event_date) && booking.status === "confirmed" && (
                <button
                  className={styles.reviewButton}
                  onClick={() => navigate(`/review/add/${booking.hall_id}`)}
                >
                  הוסף תגובה
                </button>
              )}

              {/* כפתור ביטול – רק אם לא עבר תאריך וסטטוס מאושר */}
              {!hasDatePassed(booking.event_date) && booking.status === "confirmed" && (
                <button
                  className={styles.cancelButton}
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  בטל הזמנה
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
