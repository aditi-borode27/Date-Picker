import React, { useState, useEffect } from 'react';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = () => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [recurrence, setRecurrence] = useState({ type: 'daily', interval: 1 });

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  if (!mounted) return null;

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = currentDate ? getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) : 0;
  const firstDayOfMonth = currentDate ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() : 0;

  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const getRecurrenceDates = () => {
    if (!selectedDate) return [];
    const dates = [];
    for (let i = 0; i < 5; i++) {
      let nextDate;
      switch (recurrence.type) {
        case 'daily':
          nextDate = addDays(selectedDate, recurrence.interval * i);
          break;
        case 'weekly':
          nextDate = addWeeks(selectedDate, recurrence.interval * i);
          break;
        case 'monthly':
          nextDate = addMonths(selectedDate, recurrence.interval * i);
          break;
        case 'yearly':
          nextDate = addYears(selectedDate, recurrence.interval * i);
          break;
        default:
          break;
      }
      dates.push(nextDate);
    }
    return dates;
  };

  if (!currentDate) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-sm text-gray-500 dark:text-gray-400">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelected = selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
          return (
            <button
              key={day}
              className={`w-full h-8 rounded-full ${
                isSelected 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
              } transition-colors duration-200`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
        </span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <select
            value={recurrence.type}
            onChange={(e) => setRecurrence({ ...recurrence, type: e.target.value })}
            className="border rounded p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="number"
            value={recurrence.interval}
            onChange={(e) => setRecurrence({ ...recurrence, interval: parseInt(e.target.value) })}
            className="border rounded p-2 w-20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            min={1}
          />
        </div>
      </div>
      {selectedDate && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Recurring Dates:</h3>
          <ul className="space-y-1">
            {getRecurrenceDates().map((date, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{format(date, 'PPP')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DatePicker;