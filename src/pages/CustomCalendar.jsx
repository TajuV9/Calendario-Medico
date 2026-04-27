import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateClick) onDateClick(date);
  };

  return (
    <div className="card p-4 shadow-sm">
      <Calendar
        onChange={handleChange}
        value={selectedDate}
        className="w-100 border-0"
      />
    </div>
  );
};

export default CustomCalendar;