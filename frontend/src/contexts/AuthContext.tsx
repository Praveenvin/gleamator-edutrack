import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export type UserRole = "admin" | "faculty" | "student";

interface User {
  id?: number; // added safely (optional)
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

  // Load user from localStorage
  useEffect(() => {
  const stored = localStorage.getItem("user");

  if (stored) {
    try {
      const parsedUser = JSON.parse(stored);

      setUser(parsedUser);

      const currentPath = window.location.pathname;
      const correctPath = rolePaths[parsedUser.role];

      // 🔥 ONLY redirect if wrong page
      if (currentPath === "/" || currentPath === "/login") {
        navigate(correctPath);
      }

    } catch {
      localStorage.removeItem("user");
    }
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
      console.log("LOGIN RESPONSE:", data);
      const role = data.role?.toLowerCase();

      if (!["admin","faculty","student"].includes(role)) {
        throw new Error("Invalid user role");
      }

      const newUser: User = {
  id: data.id,
  username: data.username,
  role: role as UserRole
};

setUser(newUser);

// ✅ KEEP THIS
localStorage.setItem("user", JSON.stringify(newUser));

// ✅ ADD THESE LINES (VERY IMPORTANT)
localStorage.setItem("username", data.username);
localStorage.setItem("role", data.role);

// optional but useful
localStorage.setItem("user_id", data.id);
if (data.faculty_id) {
  localStorage.setItem("faculty_id", data.faculty_id);
}
if (data.student_id) {
  localStorage.setItem("student_id", data.student_id);
}
// ✅ THEN NAVIGATE
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

    localStorage.clear();

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