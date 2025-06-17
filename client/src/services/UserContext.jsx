import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "./ApiService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // טען את המשתמש מהשרת לפי הטוקן אם קיים
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) return;

    const fetchUser = async () => {
      try {
        const user = await ApiService.request({
          url: "http://localhost:3000/users/me",
          method: "GET",
        });
        setCurrentUser(user);
      } catch (err) {
        console.error("שגיאה בהבאת המשתמש מהשרת:", err);
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = async (token) => {
    try {
      localStorage.setItem("token", token);
      const user = await ApiService.request({
        url: "http://localhost:3000/users/me",
        method: "GET",
      });
      setCurrentUser(user);
    } catch (err) {
      console.error("שגיאה במהלך login:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const isLoggedIn = !!currentUser;

  return (
    <UserContext.Provider value={{ currentUser, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
