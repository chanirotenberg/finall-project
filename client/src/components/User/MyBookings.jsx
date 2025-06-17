import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await ApiService.request({
          url: "http://localhost:3000/bookings/me/details",
          method: "GET",
        });
        setBookings(res);
      } catch (err) {
        console.error("שגיאה בקבלת ההזמנות:", err);
        alert("שגיאה בטעינת ההזמנות");
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("האם אתה בטוח שברצונך לבטל את ההזמנה?")) return;
    try {
      await ApiService.request({
        url: `http://localhost:3000/bookings/${bookingId}/cancel`,
        method: "PATCH",
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "canceled" } : b
        )
      );
    } catch (err) {
      alert("שגיאה בביטול ההזמנה");
    }
  };

  const handleAddReview = (hallId) => {
    navigate(`/review/add/${hallId}`);
  };

  return (
    <div className={styles.container}>
      <h2>ההזמנות שלי</h2>
      {bookings.length === 0 ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        <ul className={styles.list}>
          {bookings.map((booking) => {
            const eventDate = new Date(booking.event_date);
            const isPast = eventDate < new Date();
            const canCancel = !isPast && booking.status === "confirmed";
            const canReview = isPast && !booking.has_reviewed;

            return (
              <li key={booking.id} className={styles.item}>
                <h3>{booking.hall.name}</h3>
                <p><strong>תאריך:</strong> {eventDate.toLocaleDateString()}</p>
                <p><strong>כתובת:</strong> {booking.hall.location}</p>
                <p><strong>סטטוס:</strong> {booking.status === "confirmed" ? "מאושרת" : "בוטלה"}</p>
                <p><strong>מס' סועדים:</strong> {booking.guests}</p>
                <p><strong>סכום לתשלום:</strong> ₪{Number(booking.payment || 0).toFixed(2)}</p>

                <p><strong>מנות קייטרינג:</strong></p>
                {booking.catering?.length > 0 ? (
                  <ul>
                    {booking.catering.map((dish, i) => (
                      <li key={i}>
                        {dish.type === "first" ? "ראשונה" :
                         dish.type === "second" ? "עיקרית" : "קינוח"}: {dish.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>לא נבחרו מנות</p>
                )}

                <div className={styles.buttonGroup}>
                  {canCancel && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleCancel(booking.id)}
                    >
                      בטל הזמנה
                    </button>
                  )}
                  {canReview && (
                    <button
                      className={styles.reviewButton}
                      onClick={() => handleAddReview(booking.hall.id)}
                    >
                      הוסף תגובה
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
