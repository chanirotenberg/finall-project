import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const newUser = { name, email, password };

      const res = await ApiService.request({
        url: "http://localhost:3000/auth/register",
        method: "POST",
        body: newUser,
      });


      if (res.token) {
        if (res.token && res.user) {
          // שמירה ב-localStorage
          login(res.user, res.token);

        }
        // localStorage.setItem("token", res.token);
        // setCurrentUser({ id: res.user.id, name: res.user.name, email: res.user.email });
        setError("");
        const returnTo = location.state?.backgroundLocation;
        navigate(returnTo.pathname + returnTo.search);
      } else {
        setError(res.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Error connecting to the server");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <input
        type="password"
        placeholder="Verify Password"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
        required
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
