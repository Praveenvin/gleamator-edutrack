import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  ClipboardCheck, FileText, BookMarked, PieChart, Settings, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/admin-dashboard/students", icon: Users },
  { title: "Faculty", url: "/admin-dashboard/faculty", icon: GraduationCap },
  { title: "Courses", url: "/admin-dashboard/courses", icon: BookOpen },
  { title: "Attendance", url: "/admin-dashboard/attendance", icon: ClipboardCheck },
  { title: "Assignments", url: "/admin-dashboard/assignments", icon: FileText },
  { title: "Study Materials", url: "/admin-dashboard/materials", icon: BookMarked },
  { title: "Leave Management", url: "/admin-dashboard/leave", icon: FileText },
  { title: "Settings", url: "/admin-dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-border flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-semibold text-primary">EduTrack</span>
        <span className="ml-2 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
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
