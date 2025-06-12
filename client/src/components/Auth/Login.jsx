import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import styles from "./AuthForm.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await ApiService.request({
        url: "http://localhost:3000/auth/login",
        method: "POST",
        body: { email, password },
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
        setCurrentUser({ id: res.user.id, name: res.user.name, email: res.user.email,  role: res.user.role
 });
        setError("");
        navigate(`/users/${res.user.id}/home`);
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
