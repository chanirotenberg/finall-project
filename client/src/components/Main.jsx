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

// קומפוננטת שמירה על התחברות
import RequireAuth from "../components/RequireAuth";

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

function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route element={<Layout />}>
          {/* פתוחים לציבור */}
          <Route path="/" element={<Home />} />
          <Route path="/users/:id/home" element={<Home />} />
          <Route path="/halls" element={<HallsList />} />
          <Route path="/halls/:hallId" element={<HallDetails />} />
          <Route path="/halls/:hallId/reviews" element={<HallReviews />} />

          {/* מוגנים */}
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/add-hall" element={<RequireAuth><AddHallRequest /></RequireAuth>} />
          <Route path="/add-catering/:hallId" element={<RequireAuth><AddCateringForHall /></RequireAuth>} />
          <Route path="/my-orders" element={<RequireAuth><MyBookings /></RequireAuth>} />
          <Route path="/booking/start/:hallId" element={<RequireAuth><BookingStart /></RequireAuth>} />
          <Route path="/booking/catering/:hallId" element={<RequireAuth><CateringPage /></RequireAuth>} />
          <Route path="/pay" element={<RequireAuth><Pay /></RequireAuth>} />
          <Route path="/review/add/:hallId" element={<RequireAuth><AddReview /></RequireAuth>} />
          <Route path="/success" element={<RequireAuth><Success /></RequireAuth>} />

          {/* מנהל */}
          <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />
          <Route path="/admin/halls" element={<RequireAuth><AdminHalls /></RequireAuth>} />
          <Route path="/admin/halls/pending" element={<RequireAuth><AdminPendingHalls /></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth><AdminUsers /></RequireAuth>} />
          <Route path="/admin/bookings" element={<RequireAuth><AdminBookingManagement /></RequireAuth>} />

          {/* בעל אולם */}
          <Route path="/owner" element={<RequireAuth><OwnerDashboard /></RequireAuth>} />
          <Route path="/owner/bookings" element={<RequireAuth><OwnerBookings /></RequireAuth>} />
          <Route path="/owner/manage-halls" element={<RequireAuth><ManageOwnerHalls /></RequireAuth>} />
          <Route path="/owner/manage-catering" element={<RequireAuth><ManageOwnerCatering /></RequireAuth>} />
        </Route>

        {/* עמודים חיצוניים ללא Layout */}
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

function Main() {
  return (
    <UserProvider>
      <Router>
        <AuthModal />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default Main;
