import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./AddHallRequest.module.css";
import { useUser } from "../../services/UserContext";

const AddHallRequest = () => {
  const { currentUser } = useUser();
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "",
    image: "",
    category: "חתונות",
    description: "",
    about: [
    ],
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAboutKeyChange = (index, newKey) => {
    const updated = [...form.about];
    updated[index].key = newKey;
    setForm((prev) => ({ ...prev, about: updated }));
  };

  const handleAboutValueChange = (index, newValue) => {
    const updated = [...form.about];
    updated[index].value = newValue;
    setForm((prev) => ({ ...prev, about: updated }));
  };

  const handleAddAboutRow = () => {
    setForm((prev) => ({
      ...prev,
      about: [...prev.about, { key: "כותרת חדשה", value: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // המרת רשימת about (מערך של אובייקטים) לאובייקט רגיל
      const aboutObj = {};
      if (form.about && Array.isArray(form.about)) {
        form.about.forEach(({ key, value }) => {
          if (key && key.trim()) aboutObj[key.trim()] = value;
        });
      }

      const res = await ApiService.request({
        url: "http://localhost:3000/halls",
        method: "POST",
        body: {
          ...form,
          price: parseFloat(form.price),
          capacity: parseInt(form.capacity),
          approved: false,
          owner_id: currentUser.id,
          about: aboutObj,
        },
      });

      console.log("res:", res); // כדי לבדוק מה באמת חוזר

      const newHallId = res.id; // ודא שזה קיים

      if (!newHallId) throw new Error("השרת לא החזיר מזהה לאולם החדש");

      navigate(`/add-catering/${newHallId}`);

    } catch (err) {
      console.error(err);
      setError("שגיאה בשליחת הבקשה");
    }
  };


  return (
    <div className={styles.container}>
      <h2>הצעת אולם חדש</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="name" placeholder="שם האולם" value={form.name} onChange={handleChange} required />
        <input name="location" placeholder="מיקום" value={form.location} onChange={handleChange} required />
        <input name="price" type="number" placeholder="מחיר" value={form.price} onChange={handleChange} required />
        <input name="capacity" type="number" placeholder="כמות משתתפים" value={form.capacity} onChange={handleChange} required />
        <input name="image" placeholder="קישור לתמונה" value={form.image} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="חתונות">חתונות</option>
          <option value="אירועים קטנים">אירועים קטנים</option>
          <option value="גני אירועים">גני אירועים</option>
        </select>
        <textarea name="description" placeholder="תיאור" value={form.description} onChange={handleChange} />

        <fieldset className={styles.aboutSection}>
          <legend>על המקום:</legend>
          {form.about.map((row, i) => (
            <div key={i} className={styles.aboutRow}>
              <input
                type="text"
                value={row.key}
                onChange={(e) => handleAboutKeyChange(i, e.target.value)}
                placeholder="כותרת"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => handleAboutValueChange(i, e.target.value)}
                placeholder="תוכן"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddAboutRow}>➕ הוסף שורה</button>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">שלח בקשה</button>
      </form>
    </div>
  );
};

export default AddHallRequest;
