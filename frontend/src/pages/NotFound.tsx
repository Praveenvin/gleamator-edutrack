import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goDashboard = () => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") navigate("/admin-dashboard");
    else if (user.role === "faculty") navigate("/faculty-dashboard");
    else navigate("/student-dashboard");

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">

      <div className="bg-card border border-border rounded-xl shadow-sm p-10 text-center max-w-md w-full animate-fade-in">

        <h1 className="text-6xl font-bold text-primary mb-4">
          404
        </h1>

        <p className="text-lg text-foreground font-medium mb-2">
          Page not found
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          The page you tried to access does not exist or has been moved.
        </p>

        <div className="flex justify-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:bg-secondary transition"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={goDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition"
          >
            <Home size={16} />
            Dashboard
          </button>

        </div>

      </div>

    </div>
  );
};

export default NotFound;