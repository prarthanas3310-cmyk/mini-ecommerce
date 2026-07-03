import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data);
    toast.success(`Welcome back, ${data.name || "friend"}`);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data);
    toast.success("Account created");
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast("Logged out", { icon: "👋" });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAdmin: !!user?.isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
