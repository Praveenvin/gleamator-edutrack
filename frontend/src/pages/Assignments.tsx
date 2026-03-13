import { DashboardLayout } from "@/components/DashboardLayout";

const assignments = [
  { title: "Sorting Algorithms Analysis", subject: "Data Structures", due: "2026-03-15", status: "Pending" },
  { title: "Matrix Transformations", subject: "Linear Algebra", due: "2026-03-12", status: "Completed" },
  { title: "Wave Optics Report", subject: "Physics", due: "2026-03-10", status: "Completed" },
  { title: "Titration Lab Report", subject: "Chemistry", due: "2026-03-18", status: "Pending" },
  { title: "Essay: AI in Education", subject: "English", due: "2026-03-20", status: "Pending" },
  { title: "Database Normalization", subject: "Computer Science", due: "2026-03-08", status: "Completed" },
];

const statusStyle: Record<string, string> = {
  Completed: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
};

const Assignments = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Assignments</h1>
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Title</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Subject</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Due Date</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.title} className="border-b border-border last:border-0 hover:bg-secondary/30">
              <td className="px-6 py-4 text-foreground">{a.title}</td>
              <td className="px-6 py-4 text-muted-foreground">{a.subject}</td>
              <td className="px-6 py-4 font-mono-data text-muted-foreground">{a.due}</td>
              <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[a.status]}`}>{a.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default Assignments;
