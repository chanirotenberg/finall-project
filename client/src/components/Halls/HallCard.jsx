import React, { useEffect, useState } from "react";
import styles from "./HallCard.module.css";
import ApiService from "../../services/ApiService";

const HallCard = ({ hall }) => {
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchHallReviews = async () => {
      try {
        const reviews = await ApiService.request({
          url: `http://localhost:3000/reviews?hall_id=${hall.id}`
        });

        if (reviews.length > 0) {
          const avg =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating("אין דירוג");
        }
      } catch (err) {
        console.error("Error fetching reviews", err);
        setAverageRating("שגיאה");
      }
    };

    fetchHallReviews();
  }, [hall.id]);

  const handleViewDetails = () => {
    alert(`נבחר אולם: ${hall.name}`);
  };

  return (
    <div className={styles.card}>
      <img
        src={hall.image || "https://via.placeholder.com/300x200"}
        alt={hall.name}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>{hall.name}</h3>
        <p>מיקום: {hall.location}</p>
        <p>מחיר: ₪{hall.price.toLocaleString()}</p>
        <p>סוג: {hall.category}</p>
        <p>דירוג ממוצע: {averageRating}</p>
        <button className={styles.detailsButton} onClick={handleViewDetails}>
          לפרטים נוספים
        </button>
      </div>
    </div>
  );
};

export default HallCard;
