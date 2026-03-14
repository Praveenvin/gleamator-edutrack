import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { BookOpen, FileText, Users, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const gradeColor: Record<string, string> = {
  "A+": "text-success bg-success/10",
  A: "text-primary bg-primary/10",
  "B+": "text-warning bg-warning/10",
  B: "text-muted-foreground bg-secondary",
};

const FacultyDashboard = () => {

  const [stats, setStats] = useState([
    { title: "My Courses", value: "0", subtitle: "Active this semester", icon: BookOpen },
    { title: "Pending Assignments", value: "0", subtitle: "To be graded", icon: FileText },
    { title: "Students in Classes", value: "0", subtitle: "Across all courses", icon: Users },
    { title: "Avg. Attendance", value: "0%", subtitle: "This month", icon: ClipboardCheck },
  ]);

  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {

      const dashboard = await axios.get(`${API}/dashboard/faculty/`);
      const assignments = await axios.get(`${API}/assignments/`);
      const marks = await axios.get(`${API}/internal-marks/`);

      setStats([
        { title: "My Courses", value: dashboard.data.courses, subtitle: "Active this semester", icon: BookOpen },
        { title: "Pending Assignments", value: dashboard.data.pending_assignments, subtitle: "To be graded", icon: FileText },
        { title: "Students in Classes", value: dashboard.data.students, subtitle: "Across all courses", icon: Users },
        { title: "Avg. Attendance", value: dashboard.data.attendance + "%", subtitle: "This month", icon: ClipboardCheck },
      ]);

      setRecentAssignments(assignments.data.slice(0,4));
      setStudentPerformance(marks.data.slice(0,5));

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <FacultyDashboardLayout>
      <p className="text-3xl font-normal text-muted-foreground mb-8">Faculty Dashboard</p>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Recent Assignments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Assignment</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Submitted</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Due</th>
                </tr>
              </thead>
              <tbody>

                {recentAssignments.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 text-foreground">{a.title}</td>
                    <td className="py-2.5 font-mono-data text-primary">{a.course}</td>
                    <td className="py-2.5 font-mono-data text-muted-foreground">{a.submitted}/{a.total}</td>
                    <td className="py-2.5 font-mono-data text-muted-foreground">{a.due_date}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Student Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Student</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Marks</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>

                {studentPerformance.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="py-2.5">
                      <p className="text-foreground">{s.student_name}</p>
                      <p className="text-xs text-muted-foreground font-mono-data">{s.student_id}</p>
                    </td>
                    <td className="py-2.5 font-mono-data text-primary">{s.course}</td>
                    <td className="py-2.5 font-mono-data text-foreground">{s.marks}</td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${gradeColor[s.grade] || ""}`}>
                        {s.grade}
                      </span>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyDashboard;