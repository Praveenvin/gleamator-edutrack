import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export type UserRole = "admin" | "faculty" | "student";

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const rolePaths: Record<UserRole, string> = {
  admin: "/admin-dashboard",
  faculty: "/faculty-dashboard",
  student: "/student-dashboard",
};

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (username: string, password: string) => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        {
          username,
          password
        }
      );

      const data = res.data;

      const newUser: User = {
        username: data.username,
        role: data.role.toLowerCase() as UserRole
      };

      setUser(newUser);

      localStorage.setItem("user", JSON.stringify(newUser));

      navigate(rolePaths[newUser.role]);

    } catch (error: any) {

      if (error.response) {
        throw new Error(error.response.data.message || "Invalid username or password");
      }

      throw new Error("Server not reachable");
    }
  };

  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}