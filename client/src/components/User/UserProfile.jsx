import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiService.request({
          url: "http://localhost:3000/users/me",
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(res);
      } catch (err) {
        console.error(err);
        setMessage("שגיאה בטעינת הנתונים");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const res = await ApiService.request({
        url: "http://localhost:3000/users/me",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: userData,
      });

      setUserData(res);
      setMessage("הפרטים עודכנו בהצלחה!");
    } catch (err) {
      console.error(err);
      setMessage("שגיאה בעת שמירת הנתונים");
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData) return <p>טוען נתונים...</p>;

  return (
    <div className={styles.profileContainer}>
      <h2>הפרופיל שלי</h2>
      <label>
        שם:
        <input type="text" name="name" value={userData.name} onChange={handleChange} />
      </label>
      <label>
        אימייל:
        <input type="email" name="email" value={userData.email} onChange={handleChange} />
      </label>
      <label>
        תפקיד:
        <select name="role" value={userData.role} onChange={handleChange}>
          <option value="user">משתמש</option>
          <option value="owner">בעל אולם</option>
          <option value="admin">מנהל</option>
        </select>
      </label>
      <label>
        מאומת:
        <input
          type="checkbox"
          name="verified"
          checked={userData.verified}
          onChange={handleChange}
        />
      </label>

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "שומר..." : "שמור"}
      </button>

      {message && (
        <p className={message.includes("שגיאה") ? styles.error : styles.success}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UserProfile;
