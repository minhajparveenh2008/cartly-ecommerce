import React, { createContext, useContext, useState, useEffect } from "react";
import api, { User } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("cartly_token");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await api.auth.getMe();
        setUser(profile);
      } catch {
        try {
          localStorage.removeItem("cartly_token");
        } catch {
          // ignore storage errors
        }
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await api.auth.login({ email, password });
    try {
      localStorage.setItem("cartly_token", data.token);
    } catch {
      // ignore storage errors
    }
    setToken(data.token);
    const loggedInUser: User = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
    };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<User> => {
    const data = await api.auth.register({
      name,
      email,
      password,
      confirmPassword,
    });
    try {
      localStorage.setItem("cartly_token", data.token);
    } catch {
      // ignore storage errors
    }
    setToken(data.token);
    const registeredUser: User = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
    };
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    try {
      localStorage.removeItem("cartly_token");
    } catch {
      // ignore storage errors
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
