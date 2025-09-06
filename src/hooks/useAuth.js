import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
        logout();
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []); // Empty dependency array since it doesn't depend on anything

  useEffect(() => {
    checkLoginStatus();
    
    // Lytt til localStorage endringer
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [checkLoginStatus]); // Now include checkLoginStatus

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return { isLoggedIn, user, logout, checkLoginStatus };
};