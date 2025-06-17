import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(null); // set to null object initially to use only the wanted properties using object destructuring / previously it was used by array destructuring
  const [loadingAuth, setLoadingAuth] = useState(true);

  //Check localStorage on mount
  useEffect(() => {
    setLoadingAuth(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserDataState(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user");
        setUserDataState(null);
      }
    } else {
      setUserDataState(null);
    }
    setLoadingAuth(false);
  }, []);

  // Function to update user
  const setUserData = (data) => {
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
    setUserDataState(data);
  };

  // Provide context values
  return (
    <UserContext.Provider value={{ userData, setUserData, loadingAuth }}>
      {children}
    </UserContext.Provider>
  );
};
