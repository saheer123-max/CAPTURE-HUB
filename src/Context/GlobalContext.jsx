import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // ✅ New state
  const [targetUser, setTargetUser] = useState(null);   // ✅ New state

  const backendUrl = "https://localhost:7037";

  // ✅ Load token and decode currentUser
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      try {
        const decoded = jwtDecode(savedToken);
        const user = {
          id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };
        setCurrentUser(user);
        console.log("✅ Token loaded & currentUser set:", user);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    }
  }, []);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    try {
      const decoded = jwtDecode(jwt);
      const user = {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      };
      setCurrentUser(user);
      console.log("✅ Logged in & currentUser set:", user);
    } catch (err) {
      console.error("❌ Error decoding during login:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCurrentUser(null);
    setTargetUser(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        token,
        login,
        logout,
        backendUrl,
        currentUser,
        setCurrentUser,
        targetUser,
        setTargetUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
