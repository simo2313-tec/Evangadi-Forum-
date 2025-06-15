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
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserDataState(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user"); // Clear corrupted data
        setUserDataState({
          // Reset to initial empty state or specific logged-out state
          userid: undefined,
          username: undefined,
          email: undefined,
          firstname: undefined,
          token: undefined,
        });
      }
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
