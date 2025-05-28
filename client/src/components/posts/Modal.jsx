import React from "react";
import styles from "./Posts.module.css";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.modalCloseButton}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;