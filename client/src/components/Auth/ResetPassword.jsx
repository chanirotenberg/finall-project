import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./AuthForm.module.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("נא למלא כתובת מייל וסיסמה חדשה");
      return;
    }

    try {
      await ApiService.request({
        url: "http://localhost:3000/auth/reset-password",
        method: "POST",
        body: { email, newPassword: password },
      });

      setMessage("הסיסמה שונתה בהצלחה! כעת ניתן להתחבר.");

      setTimeout(() => {
        navigate("/login", { state: { backgroundLocation: { pathname: "/" } } });
      }, 2000);

    } catch (err) {
      if (err.status && err.body?.error) {
        setError(err.body.error);
      } else {
        setError("אירעה שגיאה בעת שינוי הסיסמה");
      }
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>איפוס סיסמה</h2>
      <p>לכתובת: <strong>{email}</strong></p>

      <input
        type="password"
        placeholder="סיסמה חדשה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <button onClick={handleReset}>אפס סיסמה</button>
    </div>
  );
};

export default ResetPassword;
