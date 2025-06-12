import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await ApiService.request({
                    url: "http://localhost:3000/bookings/me",
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBookings(res);
            } catch (err) {
                console.error(err);
                setError("שגיאה בטעינת ההזמנות");
            }
        };

        fetchBookings();
    }, []);

    if (error) return <p>{error}</p>;
    if (bookings.length === 0) return <p>אין הזמנות קודמות</p>;

    return (
        <div className={styles.bookingsContainer}>
            <h2>ההזמנות שלי</h2>
            <table className={styles.bookingTable}>
                <thead>
                    <tr>
                        <th>אולם</th>
                        <th>תאריך אירוע</th>
                        <th>סטטוס</th>
                        <th>תשלום</th>
                        <th>דמי ביטול</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.hall_name}</td>
                            <td>{new Date(b.event_date).toLocaleDateString("he-IL")}</td>
                            <td>{translateStatus(b.status)}</td>
                            <td>{Number(b.payment).toFixed(2)} ₪</td>
                            <td>{Number(b.cancellation_fee).toFixed(2)} ₪</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const translateStatus = (status) => {
    switch (status) {
        case "pending": return "ממתין";
        case "confirmed": return "מאושר";
        case "canceled": return "בוטל";
        default: return status;
    }
};

export default MyBookings;
