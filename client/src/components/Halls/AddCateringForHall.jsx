import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./AddCateringForHall.module.css";

const courseTypes = [
  { value: "first", label: "מנה ראשונה" },
  { value: "second", label: "מנה עיקרית" },
  { value: "third", label: "קינוח" },
];

const AddCateringForHall = () => {
  const { hallId } = useParams();
  const navigate = useNavigate();
  const [catering, setCatering] = useState([
    { course_type: "first", option_name: "", price: 0 },
  ]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...catering];
    updated[index][field] = field === "price" ? parseFloat(value) : value;
    setCatering(updated);
  };

  const handleAddRow = () => {
    setCatering([...catering, { course_type: "first", option_name: "", price: 0 }]);
  };
    const handleContinue = () => {
    navigate("/");
  };

  const handleRemoveRow = (index) => {
    const updated = [...catering];
    updated.splice(index, 1);
    setCatering(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await ApiService.request({
        url: `http://localhost:3000/owner/halls/${hallId}/catering`,
        method: "PUT",
        body: { catering },
      });

      setMessage("הקייטרינג נוסף בהצלחה!");
      setTimeout(() => navigate("/"), 1500); // חזרה לדף הבית אחרי 2 שניות
    } catch (err) {
      console.error(err);
      setError("שגיאה בשמירת הקייטרינג");
    }
  };

  return (
    <div className={styles.container}>
      <h2>הוספת מנות קייטרינג לאולם</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {catering.map((item, index) => (
          <div key={index} className={styles.row}>
            <select
              value={item.course_type}
              onChange={(e) => handleChange(index, "course_type", e.target.value)}
            >
              {courseTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="שם מנה"
              value={item.option_name}
              onChange={(e) => handleChange(index, "option_name", e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="מחיר"
              value={item.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              required
            />

            <button type="button" onClick={() => handleRemoveRow(index)}>🗑️</button>
          </div>
        ))}

        <button type="button" onClick={handleAddRow}>➕ הוסף מנה</button>
        <button type="submit">💾 שמור</button>
        <button type="button" onClick={handleContinue}>לא כרגע</button>

      </form>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
    </div>
  );
};

export default AddCateringForHall;
