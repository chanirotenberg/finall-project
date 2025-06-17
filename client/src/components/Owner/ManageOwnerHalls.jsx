import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./ManageOwnerHalls.module.css";

const ManageOwnerHalls = () => {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await ApiService.request({
          url: "http://localhost:3000/owner/halls",
          method: "GET",
        });
        setHalls(res || []);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת האולמות");
      }
    };

    fetchHalls();
  }, []);

  const handleChange = (index, field, value) => {
    const newHalls = [...halls];
    newHalls[index][field] = value;
    setHalls(newHalls);
  };

  const handleAboutKeyChange = (hallIndex, oldKey, newKey) => {
    if (!newKey || newKey.trim() === "") return;

    setHalls(prevHalls => {
      const hallsCopy = [...prevHalls];
      const about = { ...(hallsCopy[hallIndex].about || {}) };

      // אם אין שינוי בשם המפתח – לא עושים כלום
      if (oldKey === newKey) return prevHalls;

      // אם קיים כבר מפתח חדש – לא מחליפים כדי לא לדרוס
      if (about.hasOwnProperty(newKey)) {
        alert("כותרת זו כבר קיימת");
        return prevHalls;
      }

      // שינוי מפתח בתוך אובייקט
      const updatedAbout = {};
      Object.entries(about).forEach(([key, val]) => {
        updatedAbout[key === oldKey ? newKey : key] = val;
      });

      hallsCopy[hallIndex] = {
        ...hallsCopy[hallIndex],
        about: updatedAbout
      };

      return hallsCopy;
    });
  };



  const handleAboutValueChange = (hallIndex, key, newValue) => {
    const updated = [...halls];
    updated[hallIndex].about[key] = newValue;
    setHalls(updated);
  };

  const handleSave = async (hall) => {
    setError("");
    console.log("Saving hall:", hall.about);
    try {
      await ApiService.request({
        url: `http://localhost:3000/owner/halls/${hall.id}`,
        method: "PUT",
        body: {
          name: hall.name,
          description: hall.description,
          image: hall.image,
          location: hall.location,
          price: hall.price,
          capacity: hall.capacity,
          category: hall.category,
          about: hall.about, // ← חשוב שזה יהיה אובייקט
        },
      });
      alert("האולם עודכן בהצלחה");
    } catch (err) {
      console.error(err);
      setError("שגיאה בעת עדכון האולם");
    }
  };

  return (
    <div className={styles.container}>
      <h2>ניהול האולמות שלי</h2>

      {error && <p className={styles.error}>{error}</p>}

      {halls.map((hall, index) => (
        <div key={hall.id} className={styles.hallCard}>
          <label>שם האולם:</label>
          <input
            type="text"
            value={hall.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />

          <label>קישור לתמונה:</label>
          <input
            type="text"
            value={hall.image}
            onChange={(e) => handleChange(index, "image", e.target.value)}
          />

          <label>תיאור:</label>
          <input
            type="text"
            value={hall.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
          />

          <label>מיקום:</label>
          <input
            type="text"
            value={hall.location}
            onChange={(e) => handleChange(index, "location", e.target.value)}
          />

          <label>מס' מקומות:</label>
          <input
            type="number"
            value={hall.capacity}
            onChange={(e) => handleChange(index, "capacity", e.target.value)}
          />

          <label>מחיר:</label>
          <input
            type="number"
            value={hall.price}
            onChange={(e) => handleChange(index, "price", e.target.value)}
          />

          <label>קטגוריה:</label>
          <select
            value={hall.category}
            onChange={(e) => handleChange(index, "category", e.target.value)}
          >
            <option value="חתונות">חתונות</option>
            <option value="אירועים קטנים">אירועים קטנים</option>
            <option value="גני אירועים">גני אירועים</option>
          </select>

          <fieldset className={styles.aboutSection}>
            <legend>על המקום (ניתן לשנות כותרת ותוכן):</legend>
            {hall.about &&
              Object.entries(hall.about).map(([key, value], i) => (
                <div key={i} className={styles.aboutRow}>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => handleAboutKeyChange(index, key, e.target.value)}
                    placeholder="כותרת (לדוגמה: מרחב)"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleAboutValueChange(index, key, e.target.value)}
                    placeholder="תוכן (לדוגמה: תזוקה מצוינת)"
                  />
                </div>
              ))}
          </fieldset>

          <button onClick={() => handleSave(hall)}>שמור שינויים</button>
        </div>
      ))}
    </div>
  );
};

export default ManageOwnerHalls;
