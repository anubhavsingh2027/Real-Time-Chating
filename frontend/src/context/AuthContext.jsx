import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  // Enhanced setTokens that tracks authentication state
  const handleSetTokens = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    if (access && refresh) {
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
    setRefreshToken(null);
    setWasAuthenticated(false);
    setShowLoginPrompt(false);
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      setTokens: handleSetTokens,
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