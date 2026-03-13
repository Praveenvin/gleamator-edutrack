import { DashboardLayout } from "@/components/DashboardLayout";

const data = [
  { subject: "Mathematics", total: 45, attended: 40, percentage: "88.9%" },
  { subject: "Physics", total: 42, attended: 36, percentage: "85.7%" },
  { subject: "Chemistry", total: 40, attended: 34, percentage: "85.0%" },
  { subject: "Computer Science", total: 48, attended: 46, percentage: "95.8%" },
  { subject: "English", total: 30, attended: 28, percentage: "93.3%" },
  { subject: "Electronics", total: 38, attended: 32, percentage: "84.2%" },
];

const Attendance = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Attendance</h1>
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Subject</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Total Classes</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Attended</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.subject} className="border-b border-border last:border-0 hover:bg-secondary/30">
              <td className="px-6 py-4 text-foreground">{r.subject}</td>
              <td className="px-6 py-4 font-mono-data text-foreground">{r.total}</td>
              <td className="px-6 py-4 font-mono-data text-foreground">{r.attended}</td>
              <td className="px-6 py-4 font-mono-data text-foreground">{r.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default Attendance;
