import React, { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import styles from "./Info.module.css"; 

const Info = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState("");
    const { currentUser } = useUser();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await ApiService.request({
                    url: `http://localhost:3000/users/${currentUser?.id}`,
                });
                setUserInfo(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (currentUser?.id) {
            fetchUserInfo();
        }
    }, [currentUser?.id]);

    if (error) {
        return <p className={styles.errorMessage}>Error: {error}</p>;
    }

    if (!userInfo) {
        return <p className={styles.loadingMessage}>Loading user information...</p>;
    }

    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.infoHeader}>User Information</h2>
              <p className={styles.infoRow}>
                <strong>ID:</strong> {userInfo.id}
            </p>
            <p className={styles.infoRow}>
                <strong>Username:</strong> {userInfo.username}
            </p>          
            <p className={styles.infoRow}>
                <strong>Email:</strong> {userInfo.email}
            </p>
            <p className={styles.infoRow}>
                <strong>Phone:</strong> {userInfo.phone_number}
            </p>
        </div>
    );
};

export default Info;
