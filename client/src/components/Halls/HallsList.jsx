import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import HallCard from "./HallCard";
import styles from "./HallsList.module.css";

const HallsList = () => {
  const location = useLocation();
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const url = category
          ? `http://localhost:3000/halls?category=${encodeURIComponent(category)}`
          : "http://localhost:3000/halls";

        const data = await ApiService.request({ url });
        setHalls(data);
      } catch (err) {
        console.error("Error fetching halls:", err);
        setError("Failed to load halls.");
      }
    };

    fetchHalls();
  }, [category]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.hallsListContainer}>
      <h2 className={styles.pageTitle}>
        {category ? `אולמות בקטגוריה: ${category}` : "כל האולמות"}
      </h2>
      <div className={styles.hallCardsGrid}>
        {halls.length > 0 ? (
          halls.map((hall) => <HallCard key={hall.id} hall={hall} />)
        ) : (
          <p className={styles.noResults}>לא נמצאו אולמות בקטגוריה זו.</p>
        )}
      </div>
    </div>
  );
};

export default HallsList;
