import { DashboardLayout } from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface Attendance {
  date: string;
  status: string;
}

interface Marks {
  course: number;
  marks: number;
}

const Reports = () => {

  const { user } = useAuth();

  const [attendanceTrend, setAttendanceTrend] = useState<any[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAttendance();
      fetchMarks();
    }
  }, [user]);

  const fetchAttendance = async () => {
    try {

      const res = await axios.get("http://127.0.0.1:8000/api/attendance/");

      const data: Attendance[] = res.data;

      const monthly: any = {};

      data.forEach((item) => {

        const month = new Date(item.date).toLocaleString("default", {
          month: "short",
        });

        if (!monthly[month]) {
          monthly[month] = { total: 0, present: 0 };
        }

        monthly[month].total++;

        if (item.status === "Present") {
          monthly[month].present++;
        }
      });

      const formatted = Object.keys(monthly).map((m) => ({
        month: m,
        percentage:
          Math.round((monthly[m].present / monthly[m].total) * 100) || 0,
      }));

      setAttendanceTrend(formatted);

    } catch (err) {
      console.error("Attendance fetch failed", err);
    }
  };

  const fetchMarks = async () => {
    try {

      const res = await axios.get("http://127.0.0.1:8000/api/marks/");

      const data: Marks[] = res.data;

      const subjects: any = {};

      data.forEach((item) => {

        if (!subjects[item.course]) {
          subjects[item.course] = [];
        }

        subjects[item.course].push(item.marks);

      });

      const formatted = Object.keys(subjects).map((subject) => {

        const marks = subjects[subject];

        const avg =
          marks.reduce((a: number, b: number) => a + b, 0) / marks.length;

        return {
          subject: subject,
          marks: Math.round(avg),
        };
      });

      setSubjectPerformance(formatted);

    } catch (err) {
      console.error("Marks fetch failed", err);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-medium text-foreground mb-6">
        Reports
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Attendance Chart */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Attendance Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* Marks Chart */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Subject Performance
          </h2>

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
};

export default Reports;