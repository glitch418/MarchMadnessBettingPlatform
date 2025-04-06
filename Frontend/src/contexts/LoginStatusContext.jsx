import { createContext, useState, useContext } from "react";

const LoginStatusContext = createContext({
  isLoggedIn: false,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const LoginStatusProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const login = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
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

export default LoginStatusContext;