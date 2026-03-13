import { DashboardLayout } from "@/components/DashboardLayout";

const marks = [
  { subject: "Mathematics", test1: 42, test2: 38, test3: 45, total: "125/150" },
  { subject: "Physics", test1: 35, test2: 40, test3: 38, total: "113/150" },
  { subject: "Chemistry", test1: 40, test2: 36, test3: 42, total: "118/150" },
  { subject: "Computer Science", test1: 48, test2: 46, test3: 50, total: "144/150" },
  { subject: "English", test1: 44, test2: 42, test3: 40, total: "126/150" },
  { subject: "Electronics", test1: 36, test2: 38, test3: 35, total: "109/150" },
];

const InternalMarks = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Internal Marks</h1>
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Subject</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Test 1 (50)</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Test 2 (50)</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Test 3 (50)</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Total (150)</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m) => (
            <tr key={m.subject} className="border-b border-border last:border-0 hover:bg-secondary/30">
              <td className="px-6 py-4 text-foreground">{m.subject}</td>
              <td className="px-6 py-4 font-mono-data text-foreground">{m.test1}</td>
              <td className="px-6 py-4 font-mono-data text-foreground">{m.test2}</td>
              <td className="px-6 py-4 font-mono-data text-foreground">{m.test3}</td>
              <td className="px-6 py-4 font-mono-data font-medium text-foreground">{m.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default InternalMarks;
