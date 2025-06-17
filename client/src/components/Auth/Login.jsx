import React, { useState } from "react";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import styles from "./AuthForm.module.css";
import { useNavigate, useLocation } from "react-router-dom";
// import jwtDecode from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [forgotMode, setForgotMode] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await ApiService.request({
        url: "http://localhost:3000/auth/login",
        method: "POST",
        body: { email, password },
      });

      if (res.token) {
        await login(res.token);

        const returnTo = location.state?.backgroundLocation;
        if (returnTo?.pathname) {
          navigate(returnTo.pathname + (returnTo.search || ""));
        } else {
          navigate("/");
        }
      } else {
        setError(res.error || "כתובת אימייל או סיסמה שגויים");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("שגיאה בחיבור לשרת");
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("נא להזין כתובת מייל לשחזור סיסמה");
      return;
    }

    try {
      await ApiService.request({
        url: "http://localhost:3000/auth/forgot-password",
        method: "POST",
        body: { email },
      });
      setMessage("קישור לשחזור סיסמה נשלח למייל שלך.");
    } catch (err) {
      console.error("Error sending forgot password email:", err);
      setError("שליחת מייל נכשלה");
    }
  };

  return (
      <form className={styles.authForm} onSubmit={handleLogin}>
        <h2>התחברות</h2>

        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!forgotMode && (
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        {!forgotMode ? (
          <>
            <button type="submit">התחבר</button>
            <p className={styles.link} onClick={() => setForgotMode(true)}>
              שכחת סיסמה?
            </p>
          </>
        ) : (
          <>
            <button type="button" onClick={handleForgotPassword}>
              שלח קישור לאיפוס סיסמה
            </button>
            <p className={styles.link} onClick={() => setForgotMode(false)}>
              ← חזרה להתחברות
            </p>
          </>
        )}
      </form>      
  );
};

export default Login;
