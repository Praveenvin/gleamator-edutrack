import { AdminSidebar } from "./AdminSidebar";
import { TopNavbar } from "./TopNavbar";
import { useAuth } from "@/contexts/AuthContext";

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {

  const { user } = useAuth();   // get logged-in user info

  return (
    <div className="flex min-h-screen w-full bg-background">

      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">

        <TopNavbar/>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>

      </div>

    </div>
  );
}