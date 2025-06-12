import React from "react";
import styles from "./HallCard.module.css";

const HallCard = ({ hall }) => {
  const handleViewDetails = () => {
    alert(`נבחר אולם: ${hall.name}`);
  };

  return (
    <div className={styles.card}>
      <img
        src={hall.image || '/images/hall.jpg'}
        alt={hall.name}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>{hall.name}</h3>
        <p>מיקום: {hall.location}</p>
        <p>מחיר: ₪{hall.price.toLocaleString()}</p>
        <p>מס' מקומות: {hall.capacity}</p>
        <p>סוג: {hall.category}</p>
        <p>דירוג ממוצע: {hall.avg_rating || "אין דירוג"}</p>
        {/* <p>מס' ביקורות: {hall.popularity}</p> */}
        <button className={styles.detailsButton} onClick={handleViewDetails}>
          לפרטים נוספים
        </button>
      </div>
    </div>
  );
};

export default HallCard;
