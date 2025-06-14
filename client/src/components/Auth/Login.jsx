import React, { useState } from "react";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import styles from "./AuthForm.module.css";
import { useNavigate, useLocation } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await ApiService.request({
        url: "http://localhost:3000/auth/login",
        method: "POST",
        body: { email, password },
      });

      if (res.token && res.user) {
        // שמירה של כל פרטי המשתמש כולל role
        login(
          {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role
          },
          res.token
        );
        setError("");
        const returnTo = location.state?.backgroundLocation;
        navigate(returnTo.pathname + returnTo.search);
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Error connecting to the server");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
