import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const enrollmentData = [
  { year: "2020", students: 320 },
  { year: "2021", students: 385 },
  { year: "2022", students: 410 },
  { year: "2023", students: 445 },
  { year: "2024", students: 480 },
  { year: "2025", students: 512 },
];

const performanceData = [
  { dept: "CS", avgGPA: 3.6 },
  { dept: "ECE", avgGPA: 3.4 },
  { dept: "Mech", avgGPA: 3.2 },
  { dept: "IT", avgGPA: 3.5 },
  { dept: "Civil", avgGPA: 3.3 },
];

const passRate = [
  { semester: "Sem 1", rate: 92 },
  { semester: "Sem 2", rate: 89 },
  { semester: "Sem 3", rate: 91 },
  { semester: "Sem 4", rate: 88 },
  { semester: "Sem 5", rate: 93 },
  { semester: "Sem 6", rate: 90 },
];

const AdminReports = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Reports & Analytics</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {[
        { label: "Total Enrollment", value: "512" },
        { label: "Avg GPA", value: "3.42" },
        { label: "Pass Rate", value: "90.5%" },
        { label: "Graduation Rate", value: "94%" },
      ].map(s => (
        <div key={s.label} className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Enrollment Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip />
            <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Pass Rate by Semester</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={passRate}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="hsl(var(--success))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Department-wise Average GPA</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 4]} />
          <Tooltip />
          <Bar dataKey="avgGPA" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </AdminDashboardLayout>
);

export default AdminReports;
