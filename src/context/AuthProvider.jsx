import React, { createContext, useEffect, useState } from "react";
import { getLocalStorage } from "../utils/localstorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // localStorage.clear()
  const [userData, setUserData] = useState(null);
  const employees = null;
  useEffect(() => {
    const employees = getLocalStorage();
    console.log("authprovider ka employees: ", employees);
    setUserData(employees);
    console.log("useeffect ke andar: ", employees);
  }, []);

  console.log("useeffect ke bahar: ", employees || "none");

  return (
    <div>
      <AuthContext.Provider value={[userData, setUserData]}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
