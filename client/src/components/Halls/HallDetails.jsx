import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./HallDetails.module.css";

const HallDetails = () => {
  const { hallId } = useParams(); // hallId מ-URL params
  const [hall, setHall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const res = await ApiService.request({
          url: `http://localhost:3000/halls/${hallId}`,
        });
        setHall(res);
      } catch (err) {
        console.error("שגיאה בטעינת האולם:", err);
      }
    };

    fetchHall();
  }, [hallId]);

const handleBookClick = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("יש להתחבר כדי לבצע הזמנה.");
    return;
  }

  navigate(`/booking/start/${hallId}`);
};


  return hall ? (
    <div className={styles.container}>
      <div className="details-side">
        {/* כפתור הזמנה מעל תמונת האולם */}
        <button onClick={handleBookClick} className="book-button">
          הזמנה
        </button>
        <img
          src={hall.image || "/images/hall.jpg"}
          alt={hall.name}
          className={styles.hallImage}
        />
      </div>

      <h2>{hall.name}</h2>
      <p>מיקום: {hall.location}</p>
      <p>מחיר: ₪{hall.price.toLocaleString()}</p>
      <p>קטגוריה: {hall.category}</p>
      <p>מספר מקומות: {hall.capacity}</p>
      <p>תיאור קצר: {hall.description}</p>

      <section id="about">
        <h3>על המקום</h3>
        {hall.about && typeof hall.about === 'object' && Object.keys(hall.about).length > 0 ? (
          <ul>
            {Object.entries(hall.about).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        ) : (
          <p>אין מידע זמין על המקום.</p>
        )}
      </section>
    </div>
  ) : (
    <p>טוען נתונים...</p>
  );
};

export default HallDetails;
