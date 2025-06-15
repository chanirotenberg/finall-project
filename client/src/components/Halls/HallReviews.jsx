import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./HallReviews.module.css";

const HallReviews = () => {
  const { hallId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [hallName, setHallName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // משיכת שם האולם
        const hall = await ApiService.request({
          url: `http://localhost:3000/halls/${hallId}`
        });
        setHallName(hall.name);

        // משיכת תגובות
        const res = await ApiService.request({
          url: `http://localhost:3000/reviews?hall_id=${hallId}`
        });
        setReviews(res);
      } catch (err) {
        console.error("שגיאה בטעינת התגובות", err);
      }
    };

    fetchData();
  }, [hallId]);

  return (
    <div className={styles.container}>
      <h2>תגובות על {hallName}</h2>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        חזור לאולם
      </button>
      {reviews.length === 0 ? (
        <p>אין תגובות עדיין.</p>
      ) : (
        <ul className={styles.reviewList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <p><strong>דירוג:</strong> {review.rating}/5</p>
              <p><strong>תגובה:</strong> {review.comment}</p>
              {review.discount_given && <p className={styles.discount}>🟢 קיבל הנחה</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HallReviews;
