import React from 'react';
import { useUser } from "../services/UserContext";
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const { currentUser} = useUser();
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw',textAlign: 'center', padding: '2rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => navigate(`/users/${currentUser.id}/home`)}>Home</button>
        </div>
    );
};

export default NotFound;
