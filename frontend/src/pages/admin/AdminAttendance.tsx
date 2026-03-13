import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const departments = [
  { dept: "Computer Science", total: 120, present: 108, percentage: 90 },
  { dept: "Electronics", total: 95, present: 82, percentage: 86 },
  { dept: "Mechanical", total: 80, present: 68, percentage: 85 },
  { dept: "Information Tech", total: 70, present: 63, percentage: 90 },
  { dept: "Civil", total: 60, present: 51, percentage: 85 },
];

const trend = [
  { month: "Jan", cs: 92, ece: 88, mech: 85 },
  { month: "Feb", cs: 89, ece: 85, mech: 82 },
  { month: "Mar", cs: 91, ece: 87, mech: 86 },
  { month: "Apr", cs: 90, ece: 86, mech: 84 },
  { month: "May", cs: 93, ece: 89, mech: 87 },
];

const AdminAttendance = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Attendance Management</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {[
        { label: "Overall Attendance", value: "87.2%", sub: "This semester" },
        { label: "Low Attendance Alerts", value: "14", sub: "Below 75%" },
        { label: "Today's Absentees", value: "38", sub: "Across all departments" },
      ].map(s => (
        <div key={s.label} className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Department-wise Attendance</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["Department", "Total Students", "Present Today", "Attendance %"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.dept} className="border-b border-border last:border-0">
              <td className="py-2.5 text-foreground">{d.dept}</td>
              <td className="py-2.5 text-foreground">{d.total}</td>
              <td className="py-2.5 text-foreground">{d.present}</td>
              <td className="py-2.5">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.percentage >= 85 ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>{d.percentage}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Attendance Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="cs" stroke="hsl(var(--primary))" name="CS" strokeWidth={2} />
          <Line type="monotone" dataKey="ece" stroke="hsl(var(--success))" name="ECE" strokeWidth={2} />
          <Line type="monotone" dataKey="mech" stroke="hsl(var(--warning))" name="Mech" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </AdminDashboardLayout>
);

export default AdminAttendance;
