import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./AdminHalls.module.css";

const AdminHalls = () => {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const data = await ApiService.request({
        url: "http://localhost:3000/admin/halls",
      });
      setHalls(data);
    } catch (err) {
      if (err.status && err.body?.error) {
        setError(err.body.error);
      } else {
        setError("שגיאה בטעינת רשימת האולמות");
      }
    }
  };

  const approveHall = async (hallId) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/admin/halls/${hallId}/approve`,
        method: "PATCH",
      });
      fetchHalls(); // רענון
    } catch (err) {
      if (err.status && err.body?.error) {
        setError(err.body.error);
      } else {
        setError("אירעה שגיאה באישור האולם");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>ניהול אולמות</h2>

      {/* <button className={styles.addButton} onClick={() => navigate("/admin/halls/new")}>
        הוספת אולם
      </button> */}

      {error && <p className={styles.error}>{error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>שם</th>
            <th>מיקום</th>
            <th>קטגוריה</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {halls.map((hall) => (
            <tr key={hall.id}>
              <td>{hall.name}</td>
              <td>{hall.location}</td>
              <td>{hall.category}</td>
              <td>{hall.approved ? "מאושר" : "ממתין לאישור"}</td>
              <td>
                {!hall.approved && (
                  <button onClick={() => approveHall(hall.id)}>אשר</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHalls;
