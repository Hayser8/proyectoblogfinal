import { createContext, useContext, useState, useEffect } from "react";
import Loading from "../components/Loading";
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("auth-token");
    setAuthToken(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      const decodedToken = decodeJWT(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        logout();
      } else {
        setAuthToken(token);
        setIsAdmin(decodedToken.isAdmin);
      }
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("isAdmin actualizado: ", isAdmin);
  }, [isAdmin]);

  if (isLoading) {
    return <Loading />;
  }

  function decodeJWT(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const login = (token) => {
    localStorage.setItem("auth-token", token);
    setAuthToken(token);
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider value={{ authToken, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,  
};

export const useAuth = () => useContext(AuthContext);
