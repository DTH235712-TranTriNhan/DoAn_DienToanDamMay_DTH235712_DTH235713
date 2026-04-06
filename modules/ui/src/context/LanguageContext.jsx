/**
 * LanguageContext.jsx — Module: UI | Flash Sale Project
 * Quản lý trạng thái ngôn ngữ (Vi/En) toàn cục.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Lấy ngôn ngữ đã lưu hoặc mặc định là Tiếng Việt ('vi')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'vi';
  });

  // Khi ngôn ngữ thay đổi, lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  /**
   * Hàm t(key): Translator function
   * @param {string} key - Khóa trong từ điển translations
   * @returns {string} - Chuỗi ký tự tương ứng
   */
  const t = (key) => {
    if (!translations[lang]) return key;
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
