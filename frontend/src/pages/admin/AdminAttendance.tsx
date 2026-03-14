import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

interface Attendance {
  id: number;
  student: number;
  course: number;
  date: string;
  status: string;
}

const AdminAttendance = () => {

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/attendance/");
      setAttendance(res.data);

      generateDepartmentStats(res.data);
      generateTrend(res.data);

    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const generateDepartmentStats = (data: Attendance[]) => {

    const map: any = {};

    data.forEach((a) => {

      if (!map[a.course]) {
        map[a.course] = { dept: `Course ${a.course}`, total: 0, present: 0 };
      }

      map[a.course].total += 1;

      if (a.status === "Present") {
        map[a.course].present += 1;
      }

    });

    const result = Object.values(map).map((d: any) => ({
      ...d,
      percentage: Math.round((d.present / d.total) * 100)
    }));

    setDepartments(result);
  };

  const generateTrend = (data: Attendance[]) => {

    const months: any = {};

    data.forEach((a) => {

      const month = new Date(a.date).toLocaleString("default", { month: "short" });

      if (!months[month]) {
        months[month] = { month, total: 0, present: 0 };
      }

      months[month].total += 1;

      if (a.status === "Present") {
        months[month].present += 1;
      }

    });

    const result = Object.values(months).map((m: any) => ({
      month: m.month,
      cs: Math.round((m.present / m.total) * 100),
      ece: Math.round((m.present / m.total) * 100),
      mech: Math.round((m.present / m.total) * 100)
    }));

    setTrend(result);
  };

  const totalRecords = attendance.length;
  const present = attendance.filter(a => a.status === "Present").length;
  const overall = totalRecords ? Math.round((present / totalRecords) * 100) : 0;

  const absenteesToday = attendance.filter(a => a.status === "Absent").length;

  const lowAttendance = departments.filter((d: any) => d.percentage < 75).length;

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">Attendance Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {[
          { label: "Overall Attendance", value: `${overall}%`, sub: "This semester" },
          { label: "Low Attendance Alerts", value: lowAttendance, sub: "Below 75%" },
          { label: "Today's Absentees", value: absenteesToday, sub: "Across all departments" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}

      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Department-wise Attendance
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              {["Department", "Total Students", "Present Today", "Attendance %"].map(h => (
                <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>

            {departments.map((d: any) => (
              <tr key={d.dept} className="border-b border-border last:border-0">

                <td className="py-2.5 text-foreground">{d.dept}</td>
                <td className="py-2.5 text-foreground">{d.total}</td>
                <td className="py-2.5 text-foreground">{d.present}</td>

                <td className="py-2.5">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.percentage >= 85 ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                    {d.percentage}%
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Attendance Trend
        </h2>

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
};

export default AdminAttendance;