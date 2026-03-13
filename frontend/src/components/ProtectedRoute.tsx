import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

export function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) return <Navigate to="/login" replace />;

  return <>{children}</>;
}