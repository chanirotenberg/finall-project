import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./CateringSelection.module.css";
import { useUser } from "../../services/UserContext"; // ← הוספת שימוש בקונטקסט

const CateringSelection = () => {
  const { hallId } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [guests, setGuests] = useState(100);
  const [error, setError] = useState("");

  const { currentUser } = useUser(); // ← במקום localStorage

  useEffect(() => {
    const fetchCatering = async () => {
      try {
        const res = await ApiService.request({
          url: `http://localhost:3000/catering/hall/${hallId}`,
        });
        setOptions(res);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת אפשרויות הקייטרינג");
        alert("שגיאה בטעינת אפשרויות הקייטרינג");
      }
    };

    fetchCatering();
  }, [hallId]);

  const handleSelect = (dish) => {
    if (selectedOptions.some((d) => d.id === dish.id)) {
      setSelectedOptions(selectedOptions.filter((d) => d.id !== dish.id));
    } else {
      setSelectedOptions([...selectedOptions, dish]);
    }
  };

  const handleNext = () => {
    if (!currentUser) {
      alert("משתמש לא מחובר");
      return;
    }

    const bookingData = JSON.parse(localStorage.getItem("bookingData") || "{}");
    const hallPrice = parseFloat(bookingData.hall_price || 0);
    const totalCateringPrice = selectedOptions.reduce(
      (sum, dish) => sum + parseFloat(dish.price || 0),
      0
    );
    const cateringCost = totalCateringPrice * guests;
    const payment = hallPrice + cateringCost;

    const fullData = {
      ...bookingData,
      catering: selectedOptions,
      guests: guests,
      total_catering_price: totalCateringPrice,
      payment: payment.toFixed(2),
      user_id: currentUser.id, // ← מזהה מה־Context
      hall_id: parseInt(hallId),
    };

    localStorage.setItem("bookingData", JSON.stringify(fullData));
    navigate("/pay", { state: { bookingData: fullData } });
  };

  const renderSection = (title, type) => {
    const filtered = options.filter((dish) => dish.course_type === type);
    if (filtered.length === 0) return null;

    return (
      <div className={styles.section}>
        <h3>{title}</h3>
        <div className={styles.grid}>
          {filtered.map((dish) => (
            <div
              key={dish.id}
              className={`${styles.card} ${
                selectedOptions.some((d) => d.id === dish.id) ? styles.selected : ""
              }`}
              onClick={() => handleSelect(dish)}
            >
              <h4>{dish.option_name}</h4>
              <p>{dish.description}</p>
              <p>₪{dish.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.cateringContainer}>
      <h2>בחירת מנות קייטרינג</h2>
      {error && <p className={styles.error}>{error}</p>}
      <p>בחרו מנות שתרצו (אפשר גם לא לבחור בכלל):</p>

      {renderSection("מנות ראשונות", "first")}
      {renderSection("מנות עיקריות", "second")}
      {renderSection("קינוחים", "third")}

      <div className={styles.controls}>
        <label>
          מספר אורחים:
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min={1}
          />
        </label>
        <button onClick={handleNext}>המשך לתשלום</button>
      </div>
    </div>
  );
};

export default CateringSelection;
