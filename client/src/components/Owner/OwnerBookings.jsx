import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./OwnerBookings.module.css";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await ApiService.request({
          url: "http://localhost:3000/owner/bookings",
          method: "GET",
        });
        setBookings(res);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת ההזמנות");
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setError("");
    setMessage("");

    try {
      await ApiService.request({
        url: `http://localhost:3000/owner/bookings/${bookingId}/cancel`,
        method: "POST",
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "canceled" } : b
        )
      );
      setMessage("ההזמנה בוטלה ונשלח מייל ללקוח");
    } catch (err) {
      console.error(err);
      setError("שגיאה בביטול ההזמנה");
    }
  };

  const isCancelable = (booking) => {
    if (booking.status !== "confirmed") return false;

    const today = new Date();
    const eventDate = new Date(booking.event_date);
    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 30;
  };

  return (
    <div className={styles.container}>
      <h2>הזמנות לאולמות שבבעלותי</h2>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>אולם</th>
            <th>תאריך</th>
            <th>מס' אורחים</th>
            <th>סטטוס</th>
            <th>שם מזמין</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.hall_name}</td>
              <td>{new Date(b.event_date).toLocaleDateString("he-IL")}</td>
              <td>{b.guests}</td>
              <td>{b.status}</td>
              <td>{b.user_name}</td>
              <td>
                {isCancelable(b) && (
                  <button onClick={() => handleCancel(b.id)}>
                    בטל הזמנה
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerBookings;
