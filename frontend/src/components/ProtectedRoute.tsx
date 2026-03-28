import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

export function ProtectedRoute({
  role,
  children
}: {
  role: UserRole | UserRole[];   // ✅ SUPPORT ARRAY
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // ✅ HANDLE MULTIPLE ROLES
  if (Array.isArray(role)) {
    if (!role.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  } else {
    if (user.role !== role) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}