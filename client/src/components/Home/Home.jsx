import React from "react";
import styles from "./Home.module.css";
import AuthModal from "../Auth/AuthModal";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <AuthModal />

      <div className={styles.banner}></div>
    </div>
  );
}

export default Home;
