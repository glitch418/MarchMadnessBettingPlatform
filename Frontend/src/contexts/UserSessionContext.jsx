import { createContext, useState, useContext } from "react";

const UserSessionContext = createContext({
  isLoggedIn: false,
  userEmail: null,
  balance: 0.00,
  login: () => {},
  logout: () => {},
  updateBalance: () => {},
});

export const UserSessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn");
    const userEmail = sessionStorage.getItem("userEmail");
    return loggedInStatus === "true" && userEmail !== null && userEmail !== '';
  });

  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem("userEmail") || null;
  });

  const [balance, setBalance] = useState(() => {
    const stored = sessionStorage.getItem("balance");
    return stored ? parseFloat(stored) : 0.00;
  });

  const login = (email, initialBalance = 0) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setBalance(initialBalance);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("balance", initialBalance.toString());
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setBalance(0);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("balance");
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    // add logic to update database here
    // set session storage item with the value returned from the database
    sessionStorage.setItem("balance", newBalance.toString());
  };

  return (
    <UserSessionContext.Provider
      value={{ isLoggedIn, userEmail, balance, login, logout, updateBalance }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  return useContext(UserSessionContext);
};

export default UserSessionProvider;