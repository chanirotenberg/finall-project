import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./CateringSelection.module.css";

const CateringSelection = () => {
  const { hallId } = useParams();
  const [cateringOptions, setCateringOptions] = useState({
    first: [],
    second: [],
    third: []
  });
  const [selectedCourses, setSelectedCourses] = useState({
    first: null,
    second: null,
    third: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCateringOptions = async () => {
      try {
        const data = await ApiService.request({
          url: `http://localhost:3000/catering/hall/${hallId}`
        });

        const options = { first: [], second: [], third: [] };
        data.forEach(option => {
          if (option.course_type === 'first') options.first.push(option);
          if (option.course_type === 'second') options.second.push(option);
          if (option.course_type === 'third') options.third.push(option);
        });

        setCateringOptions(options);
      } catch (err) {
        console.error("Error fetching catering options:", err);
      }
    };

    fetchCateringOptions();
  }, [hallId]);

  const handleCourseChange = (courseType, optionId) => {
    setSelectedCourses(prev => ({
      ...prev,
      [courseType]: optionId
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCourses.first || !selectedCourses.second || !selectedCourses.third) {
      alert("יש לבחור כל המנות");
      return;
    }

    try {
      const response = await ApiService.request({
        method: "POST",
        url: "http://localhost:3000/catering/order",
        body: { hallId, userId: 1, selectedCourses } // ✅ זה התיקון
      });

      alert("ההזמנה בוצעה בהצלחה!");
      navigate(`/booking/confirm/${response.id}`);
    } catch (err) {
      console.error("Error creating catering order:", err);
      alert("שגיאה בהזמנה");
    }
  };

  return (
    <div className={styles.cateringContainer}>
      <h2>בחר קייטרינג עבור אולם {hallId}</h2>

      <div>
        <h3>מנה ראשונה</h3>
        {cateringOptions.first.map(option => (
          <div key={option.id}>
            <input
              type="radio"
              name="first_course"
              id={`first-${option.id}`}
              value={option.id}
              onChange={() => handleCourseChange('first', option.id)}
            />
            <label htmlFor={`first-${option.id}`}>
              {option.option_name} - ₪{option.price}
            </label>
          </div>
        ))}
      </div>

      <div>
        <h3>מנה שנייה</h3>
        {cateringOptions.second.map(option => (
          <div key={option.id}>
            <input
              type="radio"
              name="second_course"
              id={`second-${option.id}`}
              value={option.id}
              onChange={() => handleCourseChange('second', option.id)}
            />
            <label htmlFor={`second-${option.id}`}>
              {option.option_name} - ₪{option.price}
            </label>
          </div>
        ))}
      </div>

      <div>
        <h3>מנה שלישית</h3>
        {cateringOptions.third.map(option => (
          <div key={option.id}>
            <input
              type="radio"
              name="third_course"
              id={`third-${option.id}`}
              value={option.id}
              onChange={() => handleCourseChange('third', option.id)}
            />
            <label htmlFor={`third-${option.id}`}>
              {option.option_name} - ₪{option.price}
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit}>הזמן קייטרינג</button>
    </div>
  );
};

export default CateringSelection;
