import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: number;
  message: string;
}

export function TopNavbar() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/");
      setNotifications(res.data);
    } catch {
      console.log("Notifications API not ready");
    }
  };

  const openProfile = () => {

    if (!user) return;

    if (user.role === "admin")
      navigate("/admin-dashboard/settings");

    else if (user.role === "faculty")
      navigate("/faculty-dashboard/profile");

    else
      navigate("/student-dashboard/profile");
  };

  const initials =
    user?.username
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 shrink-0">

      <div className="text-lg font-semibold text-foreground">
        EduTrack
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-4 relative">

        {/* NOTIFICATIONS */}

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-md hover:bg-secondary text-muted-foreground"
        >
          <Bell className="h-5 w-5" />

          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </button>

        {showNotifications && (

          <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-lg shadow-lg z-50">

            <div className="p-3 border-b border-border text-sm font-medium">
              Notifications
            </div>

            <div className="max-h-60 overflow-y-auto">

              {notifications.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground">
                  No notifications
                </p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 text-sm border-b border-border hover:bg-secondary"
                >
                  {n.message}
                </div>
              ))}

            </div>

          </div>

        )}

        {/* PROFILE */}

        <div
          onClick={openProfile}
          className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer"
        >

          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {initials}
          </div>

          <div className="hidden md:block">

            <p className="text-sm font-medium text-foreground leading-tight">
              {user?.username || "User"}
            </p>

            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}