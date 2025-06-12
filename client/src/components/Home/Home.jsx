import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../Auth/AuthModal";
import { useUser } from "../../services/UserContext";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePersonalAreaClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleCategoryClick = (category) => {
    setShowDropdown(false);
    navigate(`/halls?category=${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isPersonalButton = event.target.closest(`.${styles.personalButton}`);
      const isDropdownMenu = event.target.closest(`.${styles.dropdownMenu}`);

      if (!isPersonalButton && !isDropdownMenu) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        {/* כפתור ניהול עבור מנהל בלבד */}
        {isLoggedIn && currentUser?.role === "admin" && (
          <button onClick={() => navigate("/admin")} className={styles.navButton}>
            אזור ניהול
          </button>
        )}

        <div className={styles.personalArea}>
          <button onClick={handlePersonalAreaClick} className={styles.personalButton}>
            אזור אישי
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/profile");
                }}
              >
                פרטים אישיים
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/my-orders");
                }}
              >
                ההזמנות שלי
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                  navigate("/");
                }}
              >
                התנתקות
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal />

      <div className={styles.banner}></div>

      <footer className={styles.footer}>
        <p>© 2025 EventHalls | Built with love and code | צור קשר: contact@eventhalls.com</p>
      </footer>
    </div>
  );
}

export default Home;
