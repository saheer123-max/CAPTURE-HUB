import React, { createContext, useContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [token, setToken] = useState("");

  const backendUrl = "https://localhost:7037";

  // ✅ token browser reload ചെയ്‌താലും context-ൽ വീണ്ടും ലോഡ് ചെയ്യുന്നു
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      console.log("Token loaded from localStorage into context ✅");
    }
  }, []);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <GlobalContext.Provider value={{ token, login, logout, backendUrl }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
