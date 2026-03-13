import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, ClipboardCheck, FileText, Bell } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const stats = [
  { title: "Today's Lectures", value: "5", subtitle: "2 completed, 3 remaining", icon: BookOpen },
  { title: "Attendance Status", value: "87%", subtitle: "Above minimum requirement", icon: ClipboardCheck },
  { title: "Pending Assignments", value: "3", subtitle: "Due this week", icon: FileText },
  { title: "Unread Announcements", value: "7", subtitle: "2 urgent", icon: Bell },
];

const attendanceData = [
  { month: "Jan", Math: 92, Physics: 88, Chemistry: 85, CS: 95 },
  { month: "Feb", Math: 88, Physics: 90, Chemistry: 82, CS: 93 },
  { month: "Mar", Math: 85, Physics: 86, Chemistry: 88, CS: 90 },
  { month: "Apr", Math: 90, Physics: 84, Chemistry: 86, CS: 92 },
  { month: "May", Math: 87, Physics: 89, Chemistry: 90, CS: 94 },
];

const assignmentData = [
  { subject: "Math", Completed: 8, Pending: 2 },
  { subject: "Physics", Completed: 6, Pending: 4 },
  { subject: "Chemistry", Completed: 9, Pending: 1 },
  { subject: "CS", Completed: 7, Pending: 3 },
  { subject: "English", Completed: 10, Pending: 0 },
];

const scatterData = [
  { attendance: 92, marks: 88 }, { attendance: 85, marks: 76 },
  { attendance: 78, marks: 65 }, { attendance: 95, marks: 92 },
  { attendance: 88, marks: 82 }, { attendance: 72, marks: 60 },
  { attendance: 90, marks: 85 }, { attendance: 83, marks: 70 },
];

const materials = [
  { subject: "Data Structures", file: "DS_Notes_Ch5.pdf", date: "2026-03-08", size: "2.4 MB" },
  { subject: "Linear Algebra", file: "LA_Practice_Set.pdf", date: "2026-03-07", size: "1.8 MB" },
  { subject: "Physics", file: "Quantum_Mechanics.pdf", date: "2026-03-06", size: "3.1 MB" },
];

const leaveRequests = [
  { date: "Mar 5 - Mar 7", reason: "Family event", status: "Approved" },
  { date: "Mar 12 - Mar 13", reason: "Medical", status: "Pending" },
  { date: "Feb 20 - Feb 21", reason: "Personal", status: "Rejected" },
];

const notifications = [
  { title: "Mid-semester exams scheduled", time: "2 hours ago", urgent: true },
  { title: "New study material uploaded for CS301", time: "5 hours ago", urgent: false },
  { title: "Assignment deadline extended for Math", time: "1 day ago", urgent: false },
  { title: "Campus event: Tech Fest 2026", time: "2 days ago", urgent: false },
];

const statusColor: Record<string, string> = {
  Approved: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
  Rejected: "text-destructive bg-destructive/10",
};

const Index = () => {
  return (
    <DashboardLayout>
      {/* Welcome - sits directly on background, no card */}
      <p className="text-3xl font-normal text-muted-foreground mb-8">Welcome back, John!</p>

      {/* Stat Cards */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Attendance Report</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Math" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Physics" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Chemistry" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="CS" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Assignment Progress</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={assignmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Performance Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis type="number" dataKey="attendance" name="Attendance %" tick={{ fontSize: 12 }} domain={[60, 100]} />
              <YAxis type="number" dataKey="marks" name="Marks %" tick={{ fontSize: 12 }} domain={[50, 100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatterData} fill="#2563EB" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Materials */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Latest Study Materials</h2>
          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.file} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.subject}</p>
                  <p className="text-xs text-muted-foreground">{m.file}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono-data text-muted-foreground">{m.date}</p>
                  <p className="text-xs font-mono-data text-muted-foreground">{m.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Leave Request Status</h2>
          <div className="space-y-3">
            {leaveRequests.map((l) => (
              <div key={l.date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{l.reason}</p>
                  <p className="text-xs font-mono-data text-muted-foreground">{l.date}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[l.status]}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Notification Panel</h2>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.title} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                {n.urgent && <span className="mt-1 h-2 w-2 rounded-full bg-destructive shrink-0" />}
                {!n.urgent && <span className="mt-1 h-2 w-2 rounded-full bg-border shrink-0" />}
                <div>
                  <p className="text-sm text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
