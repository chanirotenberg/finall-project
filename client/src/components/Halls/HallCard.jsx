import React from "react";
import styles from "./HallCard.module.css";
import { useNavigate } from "react-router-dom";

const HallCard = ({ hall }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/halls/${hall.id}`);
  };

  return (
    <div className={styles.card}>
      <img
        src={hall.image || "/images/hall.jpg"}
        alt={hall.name}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>{hall.name}</h3>
        <p>מיקום: {hall.location}</p>
        <p>מחיר: ₪{hall.price?.toLocaleString()}</p>
        <p>מס' מקומות: {hall.capacity}</p>
        <p>סוג: {hall.category}</p>
        <p>דירוג ממוצע: {hall.avg_rating > 0 ? hall.avg_rating : "אין דירוג"}</p>
        <button className={styles.detailsButton} onClick={handleViewDetails}>
          לפרטים נוספים
        </button>
      </div>
    </div>
  );
};

export default HallCard;
