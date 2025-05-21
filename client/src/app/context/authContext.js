"use client";
import { useContext, createContext, useState, useEffect, use } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = auth.token;

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("prlta"));
    if (authData) {
      setAuth((prevdata) => ({
        ...prevdata,
        user: authData.user,
        token: authData.token,
      }));
    }
  }, []);

  //   Token Expiry
  useEffect(() => {
    const checkTokenExpiry = () => {
      const data = localStorage.getItem("prlta");
      if (data) {
        const { token } = JSON.parse(data);
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("prlta");
          setAuth((prevdata) => ({
            ...prevdata,
            user: null,
            token: "",
          }));
        }
      }
    };
    checkTokenExpiry();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
