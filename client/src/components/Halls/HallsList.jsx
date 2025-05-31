import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import HallCard from "./HallCard";

const HallsList = () => {
  const location = useLocation();
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        console.log("CATEGORY:", category);
        const url = category
          ? `http://localhost:3000/halls?category=${encodeURIComponent(category)}`
          : "http://localhost:3000/halls";

        const data = await ApiService.request({ url });
        console.log("HALLS RECEIVED:", data.length);
        setHalls(data);
      } catch (err) {
        console.error("Error fetching halls:", err);
        setError("Failed to load halls.");
      }
    };

    fetchHalls();
  }, [category]);

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>
        {category ? `אולמות בקטגוריה: ${category}` : "כל האולמות"}
      </h2>
      <div>
        {halls.length > 0 ? (
          halls.map((hall) => (
            <div key={hall.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
              <HallCard hall={hall} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>לא נמצאו אולמות בקטגוריה זו.</p>
        )}
      </div>
    </div>
  );
};

export default HallsList;
