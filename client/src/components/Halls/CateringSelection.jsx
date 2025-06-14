import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./CateringSelection.module.css";
import { jwtDecode } from 'jwt-decode';

const CateringSelection = () => {
  const { hallId } = useParams();
  const [cateringOptions, setCateringOptions] = useState({ first: [], second: [], third: [] });
  const [selectedCourses, setSelectedCourses] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('bookingData') || '{}');
    return saved.selectedCourses || { first: null, second: null, third: null };
  });
  const [guestCount, setGuestCount] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('bookingData') || '{}');
    return saved.guestCount || 1;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await ApiService.request({ url: `http://localhost:3000/catering/hall/${hallId}` });
        const options = { first: [], second: [], third: [] };
        data.forEach(opt => {
          if (opt.course_type === 'first') options.first.push(opt);
          if (opt.course_type === 'second') options.second.push(opt);
          if (opt.course_type === 'third') options.third.push(opt);
        });
        setCateringOptions(options);
      } catch (err) {
        console.error("בעיה בקבלת קייטרינג:", err);
      }
    };
    fetchOptions();
  }, [hallId]);

  const handleCourseChange = (type, id) => {
    const updated = { ...selectedCourses, [type]: id };
    setSelectedCourses(updated);

    const save = JSON.parse(localStorage.getItem('bookingData') || '{}');
    save.selectedCourses = updated;
    localStorage.setItem('bookingData', JSON.stringify(save));
  };

  const handleGuestChange = (e) => {
    const count = parseInt(e.target.value);
    setGuestCount(count);

    const save = JSON.parse(localStorage.getItem('bookingData') || '{}');
    save.guestCount = count;
    localStorage.setItem('bookingData', JSON.stringify(save));
  };

  const handleSubmit = () => {
    if (!selectedCourses.first || !selectedCourses.second || !selectedCourses.third) {
      alert("יש לבחור את כל המנות");
      return;
    }

    const token = localStorage.getItem("token");
    let user = null;
    if (token) {
      try {
        user = jwtDecode(token);
      } catch (e) {
        console.error("טוקן לא תקין:", e);
      }
    }
    if (!user || !user.id) {
      alert("משתמש לא מחובר");
      return;
    }

    const getPrice = (type, id) =>
      Number(cateringOptions[type].find(o => o.id === id)?.price) || 0;

    const perMealPrice =
      getPrice('first', selectedCourses.first) +
      getPrice('second', selectedCourses.second) +
      getPrice('third', selectedCourses.third);

    console.log("Price per Meal:", perMealPrice);



    const totalCatering = perMealPrice * Number(guestCount);
    console.log("Total Catering per Guest:", guestCount);
    console.log("Total Catering Price:", totalCatering);

    const savedData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    const hallPrice = Number(savedData.hall_price) || 0; // גם כאן רצוי להמיר למספר
    const eventDate = savedData.date;

    const fullPayment = hallPrice + totalCatering;
    console.log("Full Payment:", fullPayment);


    const bookingData = {
      user_id: user.id,
      hall_id: parseInt(hallId),
      event_date: eventDate,
      status: "pending",
      payment: fullPayment,
      first_course_id: selectedCourses.first,
      second_course_id: selectedCourses.second,
      third_course_id: selectedCourses.third,
      total_catering_price: totalCatering
    };

    navigate('/pay', { state: { bookingData } });
  };

  return (
    <div className={styles.cateringContainer}>
      <h2>בחירת מנות לאירוע</h2>

      <div>
        <label>מספר מנות:</label>
        <input type="number" min="1" value={guestCount} onChange={handleGuestChange} />
      </div>

      {['first', 'second', 'third'].map(type => (
        <div key={type}>
          <h3>מנה {type === 'first' ? 'ראשונה' : type === 'second' ? 'שנייה' : 'שלישית'}</h3>
          {cateringOptions[type].map(opt => (
            <div key={opt.id}>
              <input
                type="radio"
                name={`${type}_course`}
                id={`${type}-${opt.id}`}
                value={opt.id}
                checked={selectedCourses[type] === opt.id}
                onChange={() => handleCourseChange(type, opt.id)}
              />
              <label htmlFor={`${type}-${opt.id}`}>
                {opt.option_name} - ₪{opt.price}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>המשך לתשלום</button>
    </div>
  );
};

export default CateringSelection;
