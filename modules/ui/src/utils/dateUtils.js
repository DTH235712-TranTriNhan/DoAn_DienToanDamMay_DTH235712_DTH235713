/**
 * dateUtils.js - UI Helpers for Flash Sale Project
 * Provides consistent date and time formatting.
 */

/**
 * Formats a date string or object to DD/MM/YYYY HH:mm
 * @param {Date|string} dateInput 
 * @returns {string} 
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  
  // Kiểm tra tính hợp lệ của ngày
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
