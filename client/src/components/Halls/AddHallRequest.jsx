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
    category: "חתונות",
    description: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // ולידציה בסיסית בלבד בצד לקוח
  if (!form.name || !form.location || !form.price || !form.capacity) {
    setError("נא למלא את כל השדות החיוניים");
    return;
  }

  try {
    await ApiService.request({
      url: "http://localhost:3000/halls",
      method: "POST",
      body: {
        ...form,
        price: parseFloat(form.price),
        capacity: parseInt(form.capacity),
        approved: false,
        owner_id: currentUser.id,
      },
    });

    alert("הבקשה נשלחה בהצלחה! האולם ממתין לאישור מנהל.");
    navigate("/");
  } catch (err) {
    const msg =
      err.body?.error || err.message || "שגיאה בשליחת הבקשה. נסה שוב מאוחר יותר.";
    setError(msg);
  }
};


  return (
    <div className={styles.container}>
      <h2>הצעת אולם חדש</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="שם האולם"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="מיקום"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="מחיר"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="capacity"
          type="number"
          placeholder="כמות משתתפים"
          value={form.capacity}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="חתונות">חתונות</option>
          <option value="אירועים קטנים">אירועים קטנים</option>
          <option value="גני אירועים">גני אירועים</option>
        </select>
        <textarea
          name="description"
          placeholder="תיאור"
          value={form.description}
          onChange={handleChange}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">שלח בקשה</button>
      </form>
    </div>
  );
};

export default AddHallRequest;
