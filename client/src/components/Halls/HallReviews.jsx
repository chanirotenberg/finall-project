import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./HallReviews.module.css";

const HallReviews = () => {
  const { hallId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const allReviews = await ApiService.request({ url: "http://localhost:3000/reviews" });
        const hallSpecific = allReviews.filter(r => r.hall_id === parseInt(hallId));
        setReviews(hallSpecific);
      } catch (err) {
        console.error(err);
        alert("אירעה שגיאה בעת טעינת הביקורות");
      }
    };

    fetchReviews();
  }, [hallId]);

  return (
    <div className={styles.container}>
      <h2>ביקורות לאולם</h2>
      {reviews.length === 0 ? (
        <p>אין עדיין ביקורות לאולם זה.</p>
      ) : (
        <ul className={styles.reviewList}>
          {reviews.map((r) => (
            <li key={r.id} className={styles.reviewItem}>
              <p><strong>{r.user_name}:</strong> {r.comment}</p>
              <p>⭐ {r.rating}/5</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HallReviews;
