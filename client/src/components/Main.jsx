import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "../services/UserContext";
import Home from './Home/Home';
import HallsList from './Halls/HallsList';
import UserProfile from './User/UserProfile';
import MyBookings from "./User/MyBookings";
import HallDetails from "./Halls/HallDetails";
import BookingStart from "./Halls/BookingStart";
// import DateSelectionPage from './Halls/DateSelectionPage';
import CateringPage from './Halls/CateringSelection';
// import BrideChairPage from './Halls/BrideChairPage';
// import NotFound from './NotFound';


function Main() {
    return (
        <>
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/users/:id/home" element={<Home />} />
                        <Route path="/login" element={<Home />} />
                        <Route path="/register" element={<Home />} />
                        <Route path="/halls" element={<HallsList />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/my-orders" element={<MyBookings />} />
                        <Route path="/halls/:hallId" element={<HallDetails />} />
                        <Route path="/booking/start/:hallId" element={<BookingStart />} />
                        <Route path="/booking/catering/:hallId" element={<CateringPage />} />
                        {/* <Route path="/bride-chair" element={<BrideChairPage />} /> */}

                    </Routes>
                </Router>
            </UserProvider>
        </>
    )
}
export default Main;


