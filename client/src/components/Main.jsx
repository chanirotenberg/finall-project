import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { UserProvider } from "../services/UserContext";
import AuthModal from "./Auth/AuthModal"; // Import the AuthModal component

// עמודים
import Home from "./Home/Home";
import HallsList from "./Halls/HallsList";
import BookingStart from "./Halls/BookingStart";
import Profile from "./User/UserProfile";
import AddHallRequest from "./Halls/AddHallRequest";
import MyBookings from "./User/MyBookings";
import HallDetails from "./Halls/HallDetails";
import CateringPage from "./Halls/CateringSelection";
import Pay from "./Halls/Pay";
import AdminPage from "./Admin/AdminPage";
import AdminHalls from "./Admin/AdminHalls";
import AdminPendingHalls from "./Admin/AdminPendingHalls";
import AdminUsers from "./Admin/AdminUsers";
import AdminBookingManagement from "./Admin/AdminBookingManagement";
import NotFound from "./NotFound";
import HallReviews from "./Halls/HallReviews";
import AddReview from "./User/AddReview";

// קומפוננטות מודל
import Login from "./Auth/Login";
import Register from "./Auth/Register";

// Layout עם נביגציה
import Layout from "../components/Layout"; // יצרת מראש או תוכל ליצור לפי ה־NavBar מה־Home

// חלק הפנימי שבו Routes
function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {/* מסכים רגילים, עטופים ב־Layout */}
      <Routes location={state?.backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/users/:id/home" element={<Home />} />
          <Route path="/halls" element={<HallsList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-hall" element={<AddHallRequest />} />
          <Route path="/my-orders" element={<MyBookings />} />
          <Route path="/halls/:hallId" element={<HallDetails />} />
          <Route path="/booking/start/:hallId" element={<BookingStart />} />
          <Route path="/booking/catering/:hallId" element={<CateringPage />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/halls" element={<AdminHalls />} />
          <Route path="/admin/halls/pending" element={<AdminPendingHalls />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminBookingManagement />} />
          <Route path="/halls/:hallId/reviews" element={<HallReviews />} />
          <Route path="/review/add/:hallId" element={<AddReview />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* מודלים של login/register */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
}

function Main() {
  return (
    <UserProvider>
      <Router>
        <AuthModal /> {/* כאן! מחוץ לכל layout */}
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default Main;


