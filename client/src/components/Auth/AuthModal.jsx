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

  const handleClose = () => {
    navigate("/");
  };

  const switchForm = () => {
    navigate(isLogin ? "/register" : "/login");
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
              {isLogin ? "אין לך חשבון? עבור להרשמה" : "כבר יש לך חשבון? התחבר"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
