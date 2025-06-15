import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Modal from "../Common/Modal";
import styles from "./AuthModal.module.css";

const AuthModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  // אם אין רקע שממנו נפתח, אל תציג בכלל את המודל — זה הגנה
  const background = location.state?.backgroundLocation;
  if ((isLogin || isRegister) && !background) {
    // אם נכנסו ישירות ל /login או /register בלי רקע, נשלח לדף הבית
    navigate("/", { replace: true });
    return null;
  }

  const handleClose = () => {
    if (background?.pathname) {
      navigate(background.pathname + (background.search || ""));
    } else {
      // אין רקע? נחזור לדף הבית
      navigate("/");
    }
  };
  
  const switchForm = () => {
    navigate(isLogin ? "/register" : "/login", {
      state: { backgroundLocation: background },
    });
  };

  return (
    <Modal isOpen={isLogin || isRegister} onClose={handleClose}>
      <div className={styles.modalBox}>
        <div className={styles.formContainer}>
          {isLogin ? <Login /> : <Register />}
          <div className={styles.switchArea}>
            <button
              type="button"
              className={styles.switchButton}
              onClick={switchForm}
            >
              {isLogin
                ? "אין לך חשבון? עבור להרשמה"
                : "כבר יש לך חשבון? התחבר"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
