import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const assignments = [
  { id: "ASG001", title: "Data Structures Lab 3", course: "CS301", faculty: "Dr. Wilson", due: "2025-03-20", submissions: 42, total: 48, status: "Active" },
  { id: "ASG002", title: "Digital Circuit Design", course: "ECE201", faculty: "Dr. Rao", due: "2025-03-18", submissions: 50, total: 52, status: "Active" },
  { id: "ASG003", title: "Thermodynamics Report", course: "ME201", faculty: "Dr. Singh", due: "2025-03-10", submissions: 40, total: 40, status: "Closed" },
  { id: "ASG004", title: "Web Dev Project", course: "IT301", faculty: "Dr. Gupta", due: "2025-03-25", submissions: 20, total: 38, status: "Active" },
  { id: "ASG005", title: "OS Process Scheduling", course: "CS302", faculty: "Dr. Wilson", due: "2025-03-15", submissions: 45, total: 45, status: "Closed" },
];

const statusStyle: Record<string, string> = {
  Active: "text-success bg-success/10",
  Closed: "text-muted-foreground bg-secondary",
};

const AdminAssignments = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Assignments Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {[
        { label: "Total Assignments", value: "24" },
        { label: "Active", value: "12" },
        { label: "Avg Submission Rate", value: "89%" },
      ].map(s => (
        <div key={s.label} className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
        </div>
      ))}
    </div>
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">All Assignments</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["ID", "Title", "Course", "Faculty", "Due Date", "Submissions", "Status"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id} className="border-b border-border last:border-0">
              <td className="py-2.5 font-mono text-primary text-xs">{a.id}</td>
              <td className="py-2.5 text-foreground">{a.title}</td>
              <td className="py-2.5 text-muted-foreground">{a.course}</td>
              <td className="py-2.5 text-muted-foreground">{a.faculty}</td>
              <td className="py-2.5 text-muted-foreground">{a.due}</td>
              <td className="py-2.5 text-foreground">{a.submissions}/{a.total}</td>
              <td className="py-2.5"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle[a.status]}`}>{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminDashboardLayout>
);

export default AdminAssignments;
