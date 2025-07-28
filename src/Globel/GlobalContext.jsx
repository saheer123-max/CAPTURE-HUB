// import React, { createContext, useContext, useState } from "react";

// // 🔵 Context ഉണ്ടാക്കുന്നു
// const GlobalContext = createContext();

// // 🟢 Provider component
// export const GlobalProvider = ({ children }) => {
//   const [targetUser, setTargetUser] = useState(null); // 👉 customerId, name, etc.

//   return (
//     <GlobalContext.Provider value={{ targetUser, setTargetUser }}>
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// // 🔄 Context ഉപയോഗിക്കാൻ custom hook
// export const useGlobalContext = () => useContext(GlobalContext);
