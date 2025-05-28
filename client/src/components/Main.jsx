import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "../services/UserContext";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './Home/Home';
// import NotFound from './NotFound';


function Main() {
    return (
        <>
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Home />} />
                        <Route path="/register" element={<Home />} />
                        {/* <Route path="/halls" element={<HallsList />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
                    </Routes>
                </Router>
            </UserProvider>
        </>
    )
}
export default Main;

