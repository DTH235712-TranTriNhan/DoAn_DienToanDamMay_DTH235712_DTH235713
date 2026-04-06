import { createContext, useState, useEffect } from "react";
import LOCALES from "../constants/locales.js";

const LanguageContext = createContext();

// Gắn Provider trực tiếp vào đối tượng Context để tuân thủ quy tắc 1 export/file
LanguageContext.ProviderComponent = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "vi";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  /**
   * Hàm t(path): Truy xuất chuỗi văn bản đệ quy
   * path: "nav.login", "eventCard.ticketsSold"
   */
  const t = (path) => {
    const keys = path.split(".");
    let value = LOCALES[lang];

    for (const key of keys) {
      if (value === undefined || value[key] === undefined) {
        return path; // Fallback: Trả về chính cái key nếu không tìm thấy
      }
      value = value[key];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ t, lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
