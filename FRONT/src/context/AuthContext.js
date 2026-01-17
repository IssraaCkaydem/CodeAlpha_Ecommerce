

import { createContext, useContext, useState, useEffect } from "react";
import { checkAuth } from "../services/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await checkAuth(); // hits /auth/check
        if (res.authenticated) {
          setIsAuthenticated(true);
          setUser(res.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  if (isAuthenticated === null) return null; // optional: loading spinner

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
