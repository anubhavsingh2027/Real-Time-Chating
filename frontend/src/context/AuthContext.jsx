import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleUnauthorized = () => {
    setAccessToken(null);
    setShowLoginPrompt(true);
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      setAccessToken,
      showLoginPrompt,
      setShowLoginPrompt,
      handleUnauthorized
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