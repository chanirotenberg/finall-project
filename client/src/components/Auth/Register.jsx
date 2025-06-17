import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import styles from "./AuthForm.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== verifyPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    try {
      const res = await ApiService.request({
        url: "http://localhost:3000/auth/register",
        method: "POST",
        body: { name, email, password },
      });

      if (res.token && res.user) {
        await login(res.token);
        const returnTo = location.state?.backgroundLocation;
        if (returnTo?.pathname) {
          navigate(returnTo.pathname + (returnTo.search || ""));
        } else {
          navigate("/");
        }
      } else {
        setError(res.error || "הרשמה נכשלה");
      }
    } catch (err) {
      if (err.status === 400 && err.body?.error) {
        setError(err.body.error); // לדוגמה: "כתובת האימייל כבר קיימת"
      } else {
        setError("שגיאה בחיבור לשרת");
      }
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleRegister}>
      <h2>הרשמה</h2>
      <h2>הרשמה</h2>
      <input
        type="text"
        placeholder="שם"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="אימות סיסמה"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
        required
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit">הירשם</button>
    </form>
  );
};

export default Register;
