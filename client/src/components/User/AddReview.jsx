import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { jwtDecode } from "jwt-decode";
import styles from "./AddReview.module.css";

const AddReview = () => {
  const { hallId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await ApiService.request({
        url: "http://localhost:3000/reviews",
        method: "POST",
        body: {
          user_id: userId,
          hall_id: parseInt(hallId),
          rating: parseInt(rating),
          comment,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate(`/`);
    } catch (err) {
      console.error("שגיאה בשליחת תגובה:", err);
      setError("אירעה שגיאה בשליחה");
    }
  };

  return (
    <div className={styles.container}>
      <h2>הוספת תגובה</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>דירוג (1 עד 5):</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <label>תגובה:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" />

        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

export default AddReview;
