import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";

const assignments = [
  { id: "ASG001", title: "Linked List Implementation", course: "CS301", due: "2025-03-20", submitted: 38, total: 48, status: "Active" },
  { id: "ASG002", title: "Process Scheduling Simulation", course: "CS302", due: "2025-03-18", submitted: 45, total: 45, status: "Graded" },
  { id: "ASG003", title: "Binary Search Tree Operations", course: "CS301", due: "2025-03-25", submitted: 12, total: 48, status: "Active" },
  { id: "ASG004", title: "Neural Network Basics", course: "CS401", due: "2025-03-22", submitted: 30, total: 35, status: "Active" },
];

const statusStyle: Record<string, string> = {
  Active: "text-success bg-success/10",
  Graded: "text-primary bg-primary/10",
};

const FacultyAssignments = () => (
  <FacultyDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Assignments</h1>
    <div className="flex justify-end mb-4">
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">+ Create Assignment</button>
    </div>
    <div className="bg-card rounded-lg border border-border p-6">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["ID", "Title", "Course", "Due Date", "Submissions", "Status", "Action"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id} className="border-b border-border last:border-0">
              <td className="py-2.5 font-mono text-primary text-xs">{a.id}</td>
              <td className="py-2.5 text-foreground">{a.title}</td>
              <td className="py-2.5 text-muted-foreground">{a.course}</td>
              <td className="py-2.5 text-muted-foreground">{a.due}</td>
              <td className="py-2.5 text-foreground">{a.submitted}/{a.total}</td>
              <td className="py-2.5"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle[a.status]}`}>{a.status}</span></td>
              <td className="py-2.5"><button className="text-xs text-primary hover:underline">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </FacultyDashboardLayout>
);

export default FacultyAssignments;
