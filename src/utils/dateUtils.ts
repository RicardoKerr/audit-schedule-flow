
import { addDays, format, isAfter, isBefore, isWeekend, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

// Holidays in Brazil for 2024 (just as an example)
const HOLIDAYS_2024 = [
  new Date(2024, 0, 1),  // New Year
  new Date(2024, 1, 12), // Carnival
  new Date(2024, 1, 13), // Carnival
  new Date(2024, 3, 19), // Good Friday
  new Date(2024, 3, 21), // Tiradentes
  new Date(2024, 4, 1),  // Labor Day
  new Date(2024, 5, 20), // Corpus Christi
  new Date(2024, 8, 7),  // Independence Day
  new Date(2024, 9, 12), // Our Lady of Aparecida
  new Date(2024, 10, 2), // All Souls' Day
  new Date(2024, 10, 15), // Republic Day
  new Date(2024, 11, 25), // Christmas
];

// Check if a date is a holiday
export const isHoliday = (date: Date): boolean => {
  return HOLIDAYS_2024.some(holiday => 
    holiday.getDate() === date.getDate() && 
    holiday.getMonth() === date.getMonth() && 
    holiday.getFullYear() === date.getFullYear()
  );
};

// Check if a date is available for booking (not weekend or holiday, future date)
export const isDateAvailable = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    !isWeekend(date) && 
    !isHoliday(date) && 
    isAfter(date, today) && 
    isBefore(date, addDays(today, 60)) // Allow booking up to 60 days in advance
  );
};

// Format date to display in Brazilian Portuguese format
export const formatDatePtBR = (date: Date): string => {
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Get available time slots for a given date
export const getAvailableTimeSlots = (date: Date): { time: string; id: string }[] => {
  // In a real application, these would be filtered based on what's already booked
  // For this demo, we'll return a fixed set of time slots
  const businessHours = [9, 10, 11, 13, 14, 15, 16];
  
  return businessHours.map(hour => {
    const timeDate = setMinutes(setHours(new Date(), hour), 0);
    return {
      time: format(timeDate, 'HH:mm'),
      id: `${date.toISOString().split('T')[0]}-${hour}`
    };
  });
};

// Format time (HH:MM) to display
export const formatTime = (time: string): string => {
  return time;
};
