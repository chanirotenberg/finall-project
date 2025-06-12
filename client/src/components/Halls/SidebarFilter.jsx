import React, { useState, useEffect } from "react";

const SidebarFilter = ({
  onFilterChange,
  allHalls,
}) => {
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [minRating, setMinRating] = useState(0);
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => {
    const uniqueCities = [...new Set(allHalls.map(h => h.location))];
    setLocationSuggestions(uniqueCities);
  }, [allHalls]);

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
    emitFilterChange(newRange, minRating, location, capacity);
  };

  const handleRatingChange = (e) => {
    setMinRating(Number(e.target.value));
    emitFilterChange(priceRange, Number(e.target.value), location, capacity);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    emitFilterChange(priceRange, minRating, e.target.value, capacity);
  };

  const handleCapacityChange = (e) => {
    setCapacity(Number(e.target.value));
    emitFilterChange(priceRange, minRating, location, Number(e.target.value));
  };

  const emitFilterChange = (price, rating, loc, cap) => {
    onFilterChange({ priceRange: price, minRating: rating, location: loc, capacity: cap });
  };

  const handleReset = () => {
    setPriceRange([0, 30000]);
    setMinRating(0);
    setLocation("");
    setCapacity(0);
    onFilterChange({ priceRange: [0, 30000], minRating: 0, location: "", capacity: 0 });
  };

  return (
    <div style={{ padding: "20px", width: "250px", background: "#f5f5f5", borderRadius: "8px" }}>
      <h3>🔍 סינון</h3>

      <div>
        <label>טווח מחיר (₪):</label>
        <input type="range" min="0" max="30000" value={priceRange[0]} onChange={(e) => handlePriceChange(e, 0)} />
        <input type="range" min="0" max="30000" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} />
        <div>₪{priceRange[0]} - ₪{priceRange[1]}</div>
      </div>

      <div>
        <label>דירוג מינימום:</label>
        <select value={minRating} onChange={handleRatingChange}>
          <option value={0}>הכל</option>
          {[1, 2, 3, 4, 5].map(star => (
            <option key={star} value={star}>{star} ⭐ ומעלה</option>
          ))}
        </select>
      </div>

      <div>
        <label>מיקום:</label>
        <input list="locations" value={location} onChange={handleLocationChange} />
        <datalist id="locations">
          {locationSuggestions.map(city => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </div>

      <div>
        <label>כמות מינימום אורחים:</label>
        <input type="number" min="0" value={capacity} onChange={handleCapacityChange} />
      </div>

      <button onClick={handleReset} style={{ marginTop: "10px", backgroundColor: "#e74c3c", color: "white" }}>
        איפוס סינון
      </button>
    </div>
  );
};

export default SidebarFilter;
