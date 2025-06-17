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
                console.error("שגיאה בטעינת מידע המשתמש:", err);
                setError("לא ניתן לטעון את פרטי המשתמש. נסה שוב מאוחר יותר.");
            }
        };

        if (currentUser?.id) {
            fetchUserInfo();
        }
    }, [currentUser?.id]);

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    if (!userInfo) {
        return <p className={styles.loadingMessage}>טוען מידע על המשתמש...</p>;
    }

    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.infoHeader}>פרטי משתמש</h2>
            <p className={styles.infoRow}><strong>ID:</strong> {userInfo.id}</p>
            <p className={styles.infoRow}><strong>שם משתמש:</strong> {userInfo.username}</p>
            <p className={styles.infoRow}><strong>אימייל:</strong> {userInfo.email}</p>
            <p className={styles.infoRow}><strong>טלפון:</strong> {userInfo.phone_number}</p>
        </div>
    );
};

export default Info;
