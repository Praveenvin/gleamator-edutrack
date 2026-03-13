import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useState } from "react";

const students = [
  { id: "STU2547", name: "Arun Kumar", status: "Present" },
  { id: "STU2546", name: "Priya Sharma", status: "Present" },
  { id: "STU2545", name: "Rahul Verma", status: "Absent" },
  { id: "STU2544", name: "Sneha Patel", status: "Present" },
  { id: "STU2543", name: "Vikram Singh", status: "Absent" },
  { id: "STU2542", name: "Anita Das", status: "Present" },
  { id: "STU2541", name: "Kiran Reddy", status: "Present" },
  { id: "STU2540", name: "Meera Joshi", status: "Present" },
];

const FacultyAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("CS301");

  return (
    <FacultyDashboardLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Attendance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: "Today's Classes", value: "3" },
          { label: "Avg Attendance", value: "88%" },
          { label: "Low Attendance Students", value: "5" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Mark Attendance</h2>
          <div className="flex items-center gap-3">
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm">
              <option value="CS301">CS301 - Data Structures</option>
              <option value="CS302">CS302 - Operating Systems</option>
              <option value="CS401">CS401 - Machine Learning</option>
            </select>
            <input type="date" defaultValue="2025-03-13" className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["ID", "Student Name", "Status"].map(h => (
              <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="py-2.5 font-mono text-primary text-xs">{s.id}</td>
                <td className="py-2.5 text-foreground">{s.name}</td>
                <td className="py-2.5">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === "Present" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Submit Attendance</button>
        </div>
      </div>
    </FacultyDashboardLayout>
  );
};

export default FacultyAttendance;
