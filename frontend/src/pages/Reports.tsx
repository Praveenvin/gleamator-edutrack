import { DashboardLayout } from "@/components/DashboardLayout";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const attendanceTrend = [
  { month: "Sep", percentage: 92 },
  { month: "Oct", percentage: 89 },
  { month: "Nov", percentage: 85 },
  { month: "Dec", percentage: 88 },
  { month: "Jan", percentage: 90 },
  { month: "Feb", percentage: 87 },
  { month: "Mar", percentage: 91 },
];

const subjectPerformance = [
  { subject: "Math", marks: 83 },
  { subject: "Physics", marks: 75 },
  { subject: "Chemistry", marks: 79 },
  { subject: "CS", marks: 96 },
  { subject: "English", marks: 84 },
  { subject: "Electronics", marks: 73 },
];

const Reports = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Reports</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="percentage" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Subject Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="marks" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </DashboardLayout>
);

export default Reports;
