import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  // Enhanced setAccessToken that tracks authentication state
  const handleSetAccessToken = (token) => {
    setAccessToken(token);
    if (token) {
      setWasAuthenticated(true);
    }
  };

  const handleUnauthorized = () => {
    // Only show login prompt if user was previously authenticated
    if (wasAuthenticated) {
      setAccessToken(null);
      // Don't show prompt on login/register pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        setShowLoginPrompt(true);
      }
    }
  };

  const clearAuth = () => {
    setAccessToken(null);
    setWasAuthenticated(false);
    setShowLoginPrompt(false);
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      setAccessToken: handleSetAccessToken,
      showLoginPrompt,
      setShowLoginPrompt,
      handleUnauthorized,
      clearAuth,
      wasAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};