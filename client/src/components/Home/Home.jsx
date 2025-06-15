import React from "react";
import styles from "./Home.module.css";
import AuthModal from "../Auth/AuthModal";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <AuthModal />

      <div className={styles.banner}></div>

      <footer className={styles.footer}>
        <p>© 2025 EventHalls | Built with love and code | צור קשר: contact@eventhalls.com</p>
      </footer>
    </div>
  );
}

export default Home;
