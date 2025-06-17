import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import HallCard from "./HallCard";
import SidebarFilter from "./SidebarFilter";

const HallsList = () => {
  const location = useLocation();
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchHallsWithRatings = async () => {
      setError(""); // איפוס שגיאה
      try {
        const url = category
          ? `http://localhost:3000/halls?category=${encodeURIComponent(category)}`
          : "http://localhost:3000/halls";

        const hallsData = await ApiService.request({ url });
        const allReviews = await ApiService.request({ url: "http://localhost:3000/reviews" });

        const hallsWithRatings = hallsData.map(hall => {
          const hallReviews = allReviews.filter(r => r.hall_id === hall.id);
          const avg = hallReviews.length
            ? (hallReviews.reduce((sum, r) => sum + r.rating, 0) / hallReviews.length).toFixed(1)
            : 0;
          return {
            ...hall,
            avg_rating: Number(avg),
            popularity: hallReviews.length
          };
        });

        setHalls(hallsWithRatings);
        setFilteredHalls(hallsWithRatings);
      } catch (err) {
        console.error("Error fetching halls or reviews:", err);
        setError("אירעה שגיאה בטעינת האולמות. נסה שוב מאוחר יותר.");
      }
    };

    fetchHallsWithRatings();
  }, [category]);

  const handleFilterChange = ({ priceRange, minRating, location, capacity }) => {
    let result = halls.filter(hall => {
      return (
        hall.price >= priceRange[0] &&
        hall.price <= priceRange[1] &&
        (!minRating || hall.avg_rating >= minRating) &&
        (!location || hall.location.includes(location)) &&
        (!capacity || hall.capacity >= capacity)
      );
    });

    if (sortOption) {
      result = applySorting(result, sortOption);
    }

    setFilteredHalls(result);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    const sorted = applySorting(filteredHalls, option);
    setFilteredHalls(sorted);
  };

  const applySorting = (data, option) => {
    const sorted = [...data];
    switch (option) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.avg_rating - a.avg_rating);
        break;
      case "popularity-desc":
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        break;
    }
    return sorted;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px", background: "#f0f0f0", textAlign: "center" }}>
        <label htmlFor="sort">מיון לפי: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="">ללא מיון</option>
          <option value="price-asc">מחיר נמוך לגבוה</option>
          <option value="price-desc">מחיר גבוה לנמוך</option>
          <option value="rating-desc">דירוג מגבוה לנמוך</option>
          <option value="popularity-desc">פופולריות (כמות ביקורות)</option>
        </select>
      </div>

      <div style={{ display: "flex" }}>
        <SidebarFilter allHalls={halls} onFilterChange={handleFilterChange} />

        <div style={{ flex: 1, padding: "20px" }}>
          <h2>{category ? `אולמות בקטגוריה: ${category}` : "כל האולמות"}</h2>

          {error ? (
            <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px"
              }}
            >
              {filteredHalls.length > 0 ? (
                filteredHalls.map((hall) => <HallCard key={hall.id} hall={hall} />)
              ) : (
                <p>לא נמצאו אולמות תואמים.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallsList;