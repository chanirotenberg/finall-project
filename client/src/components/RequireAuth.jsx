import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  console.log("🔒 RequireAuth נבדק");

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("❌ אין טוקן – הפניה לדף הבית");
    return <Navigate to="/" replace />;
  }
  console.log("✅ יש טוקן – מציג את הדף");
  return children;
};

export default RequireAuth;
