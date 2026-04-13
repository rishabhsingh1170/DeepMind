import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getToken, clearAuthData } from "../utils/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  const login = (authResponse) => {
    setUser(authResponse.user);
    setToken(authResponse.access_token);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    try {
      const authData = localStorage.getItem("auth");
      if (!authData) {
        return;
      }

      const parsed = JSON.parse(authData);
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...parsed,
          user: updatedUser,
        }),
      );
    } catch (error) {
      console.error("Error updating auth user:", error);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
