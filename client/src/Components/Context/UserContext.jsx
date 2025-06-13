import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserDataState] = useState({
    userid: undefined,
    username: undefined,
    email: undefined,
    firstname: undefined,
    token: undefined,
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserDataState(JSON.parse(storedUser));
    }
  }, []);

  // Wrap setUserData to also update localStorage
  const setUserData = (data) => {
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
    setUserDataState(data);
  };

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      {children}
    </UserContext.Provider>
  );
};
