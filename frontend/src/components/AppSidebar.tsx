import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardCheck, Calendar, BookOpen,
  FileText, BarChart3, CalendarOff, MessageSquare, PieChart, UserCog, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", url: "/student-dashboard", icon: LayoutDashboard },
  { title: "Attendance", url: "/student-dashboard/attendance", icon: ClipboardCheck },
  { title: "Timetable", url: "/student-dashboard/timetable", icon: Calendar },
  { title: "Study Material", url: "/student-dashboard/study-material", icon: BookOpen },
  { title: "Assignments", url: "/student-dashboard/assignments", icon: FileText },
  { title: "Internal Marks", url: "/student-dashboard/internal-marks", icon: BarChart3 },
  { title: "Leave Requests", url: "/student-dashboard/leave-requests", icon: CalendarOff },
  { title: "Messaging", url: "/student-dashboard/messaging", icon: MessageSquare },
  { title: "Reports", url: "/student-dashboard/reports", icon: PieChart },
  { title: "Profile & Settings", url: "/student-dashboard/profile", icon: UserCog },
];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-border flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-semibold text-primary">EduTrack</span>
        <span className="ml-2 text-xs font-medium bg-chart-blue/10 text-primary px-2 py-0.5 rounded">Student</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.url;
          return (
            <Link key={item.url} to={item.url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active ? "bg-primary text-primary-foreground font-medium" : "text-sidebar-foreground hover:bg-secondary"
              }`}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button onClick={() => { logout(); navigate("/login"); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 w-full transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
