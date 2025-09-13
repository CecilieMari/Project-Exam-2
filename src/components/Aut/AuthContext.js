import React, { createContext, useContext, useState } from "react";
import { authAPI } from "../Api/Api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      const { accessToken: token, ...userData } = response.data;

      setAccessToken(token);
      setUser(userData);
      localStorage.setItem("accessToken", token);

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  const isVenueManager = () => {
    return user?.venueManager === true;
  };

  const isCustomer = () => {
    return user && user.venueManager === false;
  };

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    isVenueManager,
    isCustomer,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
