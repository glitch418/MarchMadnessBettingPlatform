import { createContext, useState, useContext } from "react";
import { changeBalance } from "../utils/api";

const UserSessionContext = createContext({
  isLoggedIn: false,
  userId: null,
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
    const userId = sessionStorage.getItem("userId")
    return loggedInStatus === "true" && userEmail !== null && userEmail !== '';
  });

  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem("userEmail") || null;
  });

  const [userId, setUserId] = useState(() => {
    return sessionStorage.getItem("userId") || null;
  });

  const [balance, setBalance] = useState(() => {
    const stored = sessionStorage.getItem("balance");
    return stored ? parseFloat(stored) : 0.00;
  });

  const login = (email, id, initialBalance = 0) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserId(id)
    setBalance(initialBalance);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userId", id.toString());
    sessionStorage.setItem("balance", initialBalance.toString());
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserId(null);
    setBalance(0);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("balance");
  };

  const updateBalance = async (amount) => {
    const updatedBalance = balance + amount;
    setBalance(updatedBalance);
    sessionStorage.setItem("balance", updatedBalance.toString());
  };

  return (
    <UserSessionContext.Provider
      value={{ isLoggedIn, userId, userEmail, balance, login, logout, updateBalance }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  return useContext(UserSessionContext);
};

export default UserSessionProvider;