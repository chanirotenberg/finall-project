import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../Auth/AuthModal";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handlePersonalAreaClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/halls?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navBar}>
        <button onClick={() => handleCategoryClick("חתונות")} className={styles.navButton}>
          אולמות חתונות
        </button>
        <button onClick={() => handleCategoryClick("אירועים קטנים")} className={styles.navButton}>
          אולמות אירועים קטנים
        </button>
        <button onClick={() => handleCategoryClick("גני אירועים")} className={styles.navButton}>
          גני אירועים
        </button>
        <div className={styles.personalArea}>
          <button onClick={handlePersonalAreaClick} className={styles.personalButton}>
            אזור אישי
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => navigate("/profile")}>פרטים אישיים</button>
              <button onClick={() => navigate("/my-orders")}>ההזמנות שלי</button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                  window.location.reload();
                }}
              >
                התנתקות
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal />

      {/* BANNER IMAGE */}
      <div className={styles.banner}></div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2025 EventHalls | Built with love and code | צור קשר: contact@eventhalls.com</p>
      </footer>
    </div>
  );
}

export default Home;
