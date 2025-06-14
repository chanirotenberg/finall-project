import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "../services/UserContext";

// עמודים למשתמש רגיל
import Home from "./Home/Home";
import HallsList from "./Halls/HallsList";
import BookingStart from "./Halls/BookingStart";
import Profile from "./User/UserProfile";
import AddHallRequest from "./Halls/AddHallRequest";
import MyBookings from "./User/MyBookings";
import HallDetails from "./Halls/HallDetails";
import CateringPage from './Halls/CateringSelection';
import Pay from "./Halls/Pay"; // עמוד תשלום
 // הוספת אולם חדש

// עמודים לניהול
import AdminPage from "./Admin/AdminPage";
import AdminHalls from "./Admin/AdminHalls";
import AdminPendingHalls from "./Admin/AdminPendingHalls";
import AdminUsers from "./Admin/AdminUsers";
import AdminBookingManagement from "./Admin/AdminBookingManagement";

// עמוד 404
import NotFound from "./NotFound";

function Main() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* דפי משתמש רגיל */}
          <Route path="/" element={<Home />} />
          <Route path="/users/:id/home" element={<Home />} />
          <Route path="/login" element={<Home />} />
          <Route path="/register" element={<Home />} />
          <Route path="/halls" element={<HallsList />} />
          {/* <Route path="/booking/:hallId" element={<BookingStart />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-hall" element={<AddHallRequest />} />
          <Route path="/my-orders" element={<MyBookings />} />
          <Route path="/halls/:hallId" element={<HallDetails />} />
          <Route path="/booking/start/:hallId" element={<BookingStart />} />
          <Route path="/booking/catering/:hallId" element={<CateringPage />} />
          <Route path="/pay" element={<Pay />} />

          {/* דפי ניהול */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/halls" element={<AdminHalls />} />
          <Route path="/admin/halls/pending" element={<AdminPendingHalls />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminBookingManagement />} />

          {/* עמוד ברירת מחדל */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default Main;