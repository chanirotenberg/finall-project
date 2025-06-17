import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./AdminUsers.module.css";   

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await ApiService.request({
                url: "http://localhost:3000/admin/users",
            });
            setUsers(data);
        } catch (err) {
            if (err.status && err.body?.error) {
                setError(err.body.error);
            } else {
                setError("שגיאה בטעינת המשתמשים");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2>ניהול משתמשים</h2>
            {error && <p className={styles.error}>{error}</p>}

            {users.length === 0 ? (
                <p>אין משתמשים להצגה.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>שם</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>תאריך יצירה</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{new Date(user.created_at).toLocaleDateString("he-IL")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;
