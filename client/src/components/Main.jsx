import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "../services/UserContext";
import AuthModal from "./Auth/AuthModal";

// עמודים ראשיים
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
import Success from "./User/Success";
import OwnerDashboard from "./Owner/OwnerDashboard";
import OwnerBookings from "./Owner/OwnerBookings";
import AddCateringForHall from "./Halls/AddCateringForHall";
// import OwnerDiscounts from "./Owner/OwnerDiscounts";
import ManageOwnerHalls from "./Owner/ManageOwnerHalls";
import ManageOwnerCatering from "./Owner/ManageOwnerCatering";

// מודלים
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ResetPassword from "./Auth/ResetPassword";

// Layout עם header + footer
import Layout from "../components/Layout";

// הפונקציה שמנהלת את כל ה־Routes
function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {/* כל הדפים הרגילים עטופים ב־Layout */}
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
          <Route path="/success" element={<Success />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/add-catering/:hallId" element={<AddCateringForHall />} />

          {/* <Route path="/owner/discounts" element={<OwnerDiscounts />} /> */}
          <Route path="/owner/manage-halls" element={<ManageOwnerHalls />} />
          <Route path="/owner/manage-catering" element={<ManageOwnerCatering />} />
        </Route>

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* מודלים שמופיעים מעל הדף הנוכחי */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
}

// הפונקציה הראשית שעוטפת את הכול
function Main() {
  return (
      <GoogleOAuthProvider clientId="1032852609169-p3qacavert3r8t33t35t4nr3rv6a5nl6.apps.googleusercontent.com">
    <UserProvider>
      <Router>
        <AuthModal />
        <AppRoutes />
      </Router>
    </UserProvider>
      </GoogleOAuthProvider>

  );
}

export default Main;
