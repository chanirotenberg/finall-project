import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./AdminPendingHalls.module.css";

const AdminPendingHalls = () => {
    const [pendingHalls, setPendingHalls] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPendingHalls();
    }, []);

    const fetchPendingHalls = async () => {
        try {
            const data = await ApiService.request({
                url: "http://localhost:3000/admin/halls/pending",
            });
            setPendingHalls(data);
        } catch (err) {
            setError("שגיאה בטעינת האולמות הממתינים");
        }
    };

    const approveHall = async (hall) => {
        try {
            await ApiService.request({
                url: `http://localhost:3000/admin/halls/${hall.id}/approve`,
                method: "PATCH",
                body: {
                    ...hall,
                    approved: true
                },
            });
            fetchPendingHalls();
        } catch (err) {
            setError("שגיאה באישור האולם");
        }
    };


    return (
        <div className={styles.container}>
            <h2>אולמות הממתינים לאישור</h2>
            {error && <p className={styles.error}>{error}</p>}

            {pendingHalls.length === 0 ? (
                <p>אין אולמות ממתינים.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>שם</th>
                            <th>מיקום</th>
                            <th>מחיר</th>
                            <th>קטגוריה</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingHalls.map((hall) => (
                            <tr key={hall.id}>
                                <td>{hall.name}</td>
                                <td>{hall.location}</td>
                                <td>{hall.price} ₪</td>
                                <td>{hall.category}</td>
                                <td>
                                    <button onClick={() => approveHall(hall)}>אשר</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPendingHalls;
