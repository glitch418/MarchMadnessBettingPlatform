import { createContext, useState, useContext } from "react";

const LoginStatusContext = createContext({
  isLoggedIn: false,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const LoginStatusProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem("userEmail");
  });

  const login = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");
  };

  return (
    <LoginStatusContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </LoginStatusContext.Provider>
  );
};

export const useLoginStatus = () => {
  return useContext(LoginStatusContext);
};