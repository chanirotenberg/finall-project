// import React, { useEffect, useState } from "react";
// import ApiService from "../../services/ApiService";
// import styles from "./OwnerDiscounts.module.css";

// const OwnerDiscounts = () => {
//   const [halls, setHalls] = useState([]);
//   const [selectedHallId, setSelectedHallId] = useState("");
//   const [date, setDate] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchHalls = async () => {
//       try {
//         const res = await ApiService.request({
//           url: "http://localhost:3000/owner/halls",
//           method: "GET",
//         });
//         setHalls(res || []);
//       } catch (err) {
//         console.error(err);
//         setError("שגיאה בטעינת האולמות שלך");
//       }
//     };

//     fetchHalls();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!selectedHallId || !date || !discount) {
//       setError("נא למלא את כל השדות");
//       return;
//     }

//     try {
//       await ApiService.request({
//         url: "http://localhost:3000/owner/discounts",
//         method: "POST",
//         body: {
//           hall_id: selectedHallId,
//           date,
//           discount: parseInt(discount),
//         },
//       });
//       setMessage("ההנחה נוספה בהצלחה!");
//     } catch (err) {
//       console.error(err);
//       setError("שגיאה בהוספת ההנחה");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>הוספת הנחה לאולם</h2>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <label>בחר אולם:</label>
//         <select
//           value={selectedHallId}
//           onChange={(e) => setSelectedHallId(e.target.value)}
//         >
//           <option value="">בחר אולם</option>
//           {halls.map((hall) => (
//             <option key={hall.id} value={hall.id}>
//               {hall.name}
//             </option>
//           ))}
//         </select>

//         <label>תאריך ההנחה:</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <label>אחוז הנחה (%):</label>
//         <input
//           type="number"
//           min="1"
//           max="100"
//           value={discount}
//           onChange={(e) => setDiscount(e.target.value)}
//         />

//         <button type="submit">שמור הנחה</button>
//       </form>

//       {message && <p className={styles.success}>{message}</p>}
//       {error && <p className={styles.error}>{error}</p>}
//     </div>
//   );
// };

// export default OwnerDiscounts;
