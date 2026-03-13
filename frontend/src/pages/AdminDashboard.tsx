import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const stats = [
  { title: "Total Students", value: "2,547", subtitle: "+124 this semester", icon: Users },
  { title: "Total Faculty", value: "156", subtitle: "Across 12 departments", icon: GraduationCap },
  { title: "Total Courses", value: "84", subtitle: "32 active this semester", icon: BookOpen },
  { title: "Attendance Overview", value: "89%", subtitle: "Average across all", icon: ClipboardCheck },
];

const deptData = [
  { name: "CS", students: 420 }, { name: "ECE", students: 380 },
  { name: "Mech", students: 350 }, { name: "Civil", students: 290 },
  { name: "EEE", students: 310 }, { name: "IT", students: 260 },
];

const attendanceAnalytics = [
  { dept: "CS", attendance: 92 }, { dept: "ECE", attendance: 87 },
  { dept: "Mech", attendance: 84 }, { dept: "Civil", attendance: 89 },
  { dept: "EEE", attendance: 86 }, { dept: "IT", attendance: 91 },
];

const COLORS = ["hsl(217,91%,60%)", "hsl(142,72%,29%)", "hsl(25,95%,53%)", "hsl(0,72%,51%)", "hsl(262,52%,47%)", "hsl(190,90%,40%)"];

const recentStudents = [
  { name: "Arun Kumar", dept: "CS", date: "Mar 10, 2026", id: "STU2547" },
  { name: "Priya Sharma", dept: "ECE", date: "Mar 09, 2026", id: "STU2546" },
  { name: "Rahul Verma", dept: "Mech", date: "Mar 08, 2026", id: "STU2545" },
  { name: "Sneha Patel", dept: "IT", date: "Mar 07, 2026", id: "STU2544" },
];

const recentCourses = [
  { course: "Advanced Data Structures", code: "CS401", faculty: "Dr. Wilson", updated: "Mar 11" },
  { course: "Digital Signal Processing", code: "ECE302", faculty: "Dr. Rao", updated: "Mar 10" },
  { course: "Thermodynamics", code: "ME201", faculty: "Dr. Singh", updated: "Mar 09" },
];

const AdminDashboard = () => (
  <AdminDashboardLayout>
    <p className="text-3xl font-normal text-muted-foreground mb-8">Admin Dashboard</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((s) => (
        <div key={s.title} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{s.title}</p>
              <p className="text-2xl font-semibold text-foreground mt-1 font-mono-data">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.subtitle}</p>
            </div>
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Students by Department</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={deptData} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Attendance Analytics</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={attendanceAnalytics}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
            <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
            <Tooltip />
            <Bar dataKey="attendance" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Recent Student Registrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Dept</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
            </tr></thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 font-mono-data text-primary">{s.id}</td>
                  <td className="py-2.5 text-foreground">{s.name}</td>
                  <td className="py-2.5 text-muted-foreground">{s.dept}</td>
                  <td className="py-2.5 text-muted-foreground font-mono-data">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Recent Course Updates</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Code</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Faculty</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Updated</th>
            </tr></thead>
            <tbody>
              {recentCourses.map((c) => (
                <tr key={c.code} className="border-b border-border last:border-0">
                  <td className="py-2.5 font-mono-data text-primary">{c.code}</td>
                  <td className="py-2.5 text-foreground">{c.course}</td>
                  <td className="py-2.5 text-muted-foreground">{c.faculty}</td>
                  <td className="py-2.5 text-muted-foreground font-mono-data">{c.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminDashboardLayout>
);

export default AdminDashboard;
