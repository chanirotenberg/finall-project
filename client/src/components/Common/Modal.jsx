import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div>
        <button onClick={onClose} className={styles.modalCloseButton}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
