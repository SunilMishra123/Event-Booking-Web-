import { createContext, useState, useContext } from 'react';
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={`${darkMode ? 'bg-[#050507] text-white' : 'bg-[#f6f6f9] text-[#0a0a14]'} min-h-screen transition-all duration-700 relative`}>
        
        <div className="fixed inset-0 pointer-events-none z-0">
          {darkMode ? (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#6d28d9]/20 rounded-full blur-[150px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0ea5e9]/15 rounded-full blur-[150px]"></div>
            </>
          ) : (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[150px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[150px]"></div>
            </>
          )}
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);