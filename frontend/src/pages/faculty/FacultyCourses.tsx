import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Users } from "lucide-react";

const courses = [
  { code: "CS301", name: "Data Structures", semester: "5th", students: 48, schedule: "Mon/Wed 10:00 AM", room: "LH-201" },
  { code: "CS302", name: "Operating Systems", semester: "5th", students: 45, schedule: "Tue/Thu 11:00 AM", room: "LH-105" },
  { code: "CS401", name: "Machine Learning", semester: "7th", students: 35, schedule: "Mon/Fri 2:00 PM", room: "LH-302" },
];

const FacultyCourses = () => (
  <FacultyDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">My Courses</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {courses.map(c => (
        <div key={c.code} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{c.code}</span>
            <span className="text-xs text-muted-foreground">{c.semester} Sem</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{c.students} students</p>
            <p>{c.schedule}</p>
            <p>Room: {c.room}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Course Schedule Overview</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["Code", "Course", "Schedule", "Room", "Students"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.code} className="border-b border-border last:border-0">
              <td className="py-2.5 font-mono text-primary text-xs">{c.code}</td>
              <td className="py-2.5 text-foreground">{c.name}</td>
              <td className="py-2.5 text-muted-foreground">{c.schedule}</td>
              <td className="py-2.5 text-muted-foreground">{c.room}</td>
              <td className="py-2.5 text-foreground">{c.students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </FacultyDashboardLayout>
);

export default FacultyCourses;
