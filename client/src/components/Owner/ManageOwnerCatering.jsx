import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./ManageOwnerCatering.module.css";

const courseTypes = [
  { value: "first", label: "מנה ראשונה" },
  { value: "second", label: "מנה עיקרית" },
  { value: "third", label: "קינוח" },
];

const ManageOwnerCatering = () => {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHallsWithCatering = async () => {
      try {
        const res = await ApiService.request({
          url: "http://localhost:3000/owner/halls-with-catering",
          method: "GET",
        });
        setHalls(res);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הנתונים");
      }
    };

    fetchHallsWithCatering();
  }, []);

  const handleCateringChange = (hallIndex, itemIndex, field, value) => {
    const updated = [...halls];
    updated[hallIndex].catering[itemIndex][field] = value;
    setHalls(updated);
  };

  const handleAddCateringItem = (hallIndex) => {
    const updated = [...halls];
    updated[hallIndex].catering.push({
      course_type: "first",
      option_name: "",
      price: 0,
    });
    setHalls(updated);
  };

  const handleRemoveCateringItem = (hallIndex, itemIndex) => {
    const updated = [...halls];
    updated[hallIndex].catering.splice(itemIndex, 1);
    setHalls(updated);
  };

  const handleSave = async (hall) => {
    setError("");
    setMessage("");

    try {
      await ApiService.request({
        url: `http://localhost:3000/owner/halls/${hall.id}/catering`,
        method: "PUT",
        body: { catering: hall.catering },
      });
      setMessage("הקייטרינג עודכן בהצלחה");
    } catch (err) {
      console.error(err);
      setError("שגיאה בעת עדכון הקייטרינג");
    }
  };

  return (
    <div className={styles.container}>
      <h2>ניהול קייטרינג</h2>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {halls.map((hall, hallIndex) => (
        <div key={hall.id} className={styles.hallBlock}>
          <h3>{hall.name}</h3>
          {hall.catering.map((item, itemIndex) => (
            <div key={item.id || itemIndex} className={styles.cateringRow}>
              <select
                value={item.course_type}
                onChange={(e) =>
                  handleCateringChange(hallIndex, itemIndex, "course_type", e.target.value)
                }
              >
                {courseTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={item.option_name}
                onChange={(e) =>
                  handleCateringChange(hallIndex, itemIndex, "option_name", e.target.value)
                }
                placeholder="שם מנה"
              />

              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleCateringChange(hallIndex, itemIndex, "price", e.target.value)
                }
                placeholder="מחיר"
              />

              <button onClick={() => handleRemoveCateringItem(hallIndex, itemIndex)}>
                הסר
              </button>
            </div>
          ))}
          <button onClick={() => handleAddCateringItem(hallIndex)}>➕ הוסף מנה</button>
          <button onClick={() => handleSave(hall)}>💾 שמור קייטרינג</button>
        </div>
      ))}
    </div>
  );
};

export default ManageOwnerCatering;
