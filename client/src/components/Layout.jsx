import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../services/UserContext";
import styles from "./Home/Home.module.css";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePersonalAreaClick = () => {
    if (!isLoggedIn) {
      // שמירת רקע של העמוד הנוכחי לפתיחת מודל
      navigate("/login", { state: { backgroundLocation: location } });
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={styles.homeContainer}>
        {/* סרגל ניווט */}
        <nav className={styles.navBar}>
          {isLoggedIn && currentUser?.role === "user" && (
            <button onClick={() => navigate("/add-hall")}>הצע אולם חדש</button>
          )}

          <button onClick={() => handleCategoryClick("חתונות")}>אולמות חתונות</button>
          <button onClick={() => handleCategoryClick("אירועים קטנים")}>אולמות אירועים קטנים</button>
          <button onClick={() => handleCategoryClick("גני אירועים")}>גני אירועים</button>

          {isLoggedIn && currentUser?.role === "admin" && (
            <button onClick={() => navigate("/admin")}>אזור ניהול</button>
          )}
          {isLoggedIn && currentUser?.role === "owner" && (
            <button onClick={() => navigate("/owner")}>אזור בעל אולם</button>
          )}

          <div className={styles.personalArea}>
            <button onClick={handlePersonalAreaClick} className={styles.personalButton}>
              אזור אישי
            </button>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => { setShowDropdown(false); navigate("/profile"); }}>פרטים אישיים</button>
                <button onClick={() => { setShowDropdown(false); navigate("/my-orders"); }}>ההזמנות שלי</button>
                <button onClick={() => { setShowDropdown(false); logout(); navigate("/"); }}>התנתקות</button>
              </div>
            )}
          </div>
        </nav>

        {/* התוכן של כל העמודים */}
        <Outlet />

        {/* פוטר */}
        <footer className={styles.footer}>
          <p>© 2025 EventHalls | צור קשר: contact@eventhalls.com</p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
