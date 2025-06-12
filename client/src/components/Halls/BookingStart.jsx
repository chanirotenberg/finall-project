import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
  import ApiService from '../../services/ApiService'; // ודא שזה הנתיב הנכון לקובץ


const BookingStart = () => {
  const { hallId } = useParams();  // קבלת hallId מתוך ה-URL
  const navigate = useNavigate();
  const [blockedDates, setBlockedDates] = useState([]);  // תאריכים חסומים (כבר תפוסים)
  const [selectedDate, setSelectedDate] = useState(() => {
    // אתחול התאריך הנבחר מ-LocalStorage אם קיים
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date) {
        return new Date(data.date);  // יצירת אובייקט Date מהתאריך השמור
      }
    }
    return null;
  });


useEffect(() => {
  const fetchBlockedDates = async () => {
    try {
      const res = await ApiService.request({
        url: `http://localhost:3000/bookings/unavailable/${hallId}`, // כתובת מלאה
        method: "GET"
      });
      const blocked = res.map(dateStr => new Date(dateStr));
      setBlockedDates(blocked);
    } catch (err) {
      console.error("שגיאה בטעינת תאריכים תפוסים:", err);
    }
  };

  if (hallId) {
    fetchBlockedDates();
  }
}, [hallId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);  
    // שמירת התאריך הנבחר ב-LocalStorage תחת המפתח 'bookingData'
    const savedData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    savedData.date = date.toISOString();  // שמירת התאריך בפורמט String (ISO)
    savedData.hallId = hallId;  // שמירת ה-hallId
    localStorage.setItem('bookingData', JSON.stringify(savedData));
  };

  const goNext = () => {
    if (selectedDate) {
      navigate(`/booking/catering/${hallId}`);  // שלב הבחירה אחרי התאריך
    }
  };

  return (
    <div className="booking-step booking-start">
      <h2>בחירת תאריך</h2>
      <DatePicker 
        selected={selectedDate}
        onChange={handleDateChange}
        excludeDates={blockedDates}
        minDate={new Date()}  // מניעת בחירת תאריכים בעבר
        dateFormat="dd/MM/yyyy"
        placeholderText="בחר תאריך להזמנה"
      />
      <div className="navigation-buttons">
        <button type="button" onClick={() => navigate(-1)}>
          חזרה
        </button>
        <button type="button" onClick={goNext} disabled={!selectedDate}>
          הבא
        </button>
      </div>
    </div>
  );
};

export default BookingStart;
