import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { BookOpen, FileText, Users, ClipboardCheck } from "lucide-react";

const stats = [
  { title: "My Courses", value: "4", subtitle: "Active this semester", icon: BookOpen },
  { title: "Pending Assignments", value: "12", subtitle: "To be graded", icon: FileText },
  { title: "Students in Classes", value: "186", subtitle: "Across all courses", icon: Users },
  { title: "Avg. Attendance", value: "91%", subtitle: "This month", icon: ClipboardCheck },
];

const recentAssignments = [
  { title: "Data Structures Lab 5", course: "CS301", submitted: 42, total: 48, due: "Mar 15" },
  { title: "OS Assignment 3", course: "CS302", submitted: 38, total: 45, due: "Mar 12" },
  { title: "DBMS Project Phase 1", course: "CS303", submitted: 30, total: 50, due: "Mar 18" },
  { title: "Algorithm Analysis HW", course: "CS301", submitted: 45, total: 48, due: "Mar 10" },
];

const studentPerformance = [
  { name: "Arun Kumar", id: "STU2101", course: "CS301", marks: 87, grade: "A" },
  { name: "Priya Sharma", id: "STU2102", course: "CS301", marks: 92, grade: "A+" },
  { name: "Rahul Verma", id: "STU2103", course: "CS302", marks: 74, grade: "B+" },
  { name: "Sneha Patel", id: "STU2104", course: "CS303", marks: 68, grade: "B" },
  { name: "Vikram Singh", id: "STU2105", course: "CS301", marks: 95, grade: "A+" },
];

const gradeColor: Record<string, string> = {
  "A+": "text-success bg-success/10",
  A: "text-primary bg-primary/10",
  "B+": "text-warning bg-warning/10",
  B: "text-muted-foreground bg-secondary",
};

const FacultyDashboard = () => (
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
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Assignment</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Submitted</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Due</th>
            </tr></thead>
            <tbody>
              {recentAssignments.map((a) => (
                <tr key={a.title} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-foreground">{a.title}</td>
                  <td className="py-2.5 font-mono-data text-primary">{a.course}</td>
                  <td className="py-2.5 font-mono-data text-muted-foreground">{a.submitted}/{a.total}</td>
                  <td className="py-2.5 font-mono-data text-muted-foreground">{a.due}</td>
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
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Student</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Marks</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Grade</th>
            </tr></thead>
            <tbody>
              {studentPerformance.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-2.5">
                    <p className="text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-mono-data">{s.id}</p>
                  </td>
                  <td className="py-2.5 font-mono-data text-primary">{s.course}</td>
                  <td className="py-2.5 font-mono-data text-foreground">{s.marks}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${gradeColor[s.grade] || ""}`}>{s.grade}</span>
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

export default FacultyDashboard;
