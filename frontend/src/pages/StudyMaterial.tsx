import { DashboardLayout } from "@/components/DashboardLayout";
import { Download } from "lucide-react";

const materials = [
  { subject: "Data Structures", title: "Binary Trees & Graphs", type: "PDF", size: "2.4 MB", date: "2026-03-08" },
  { subject: "Linear Algebra", title: "Eigenvalues Practice Set", type: "PDF", size: "1.8 MB", date: "2026-03-07" },
  { subject: "Physics", title: "Quantum Mechanics Notes", type: "PDF", size: "3.1 MB", date: "2026-03-06" },
  { subject: "Chemistry", title: "Organic Chemistry Ch. 8", type: "PDF", size: "2.0 MB", date: "2026-03-05" },
  { subject: "English", title: "Technical Writing Guide", type: "DOCX", size: "1.2 MB", date: "2026-03-04" },
  { subject: "Electronics", title: "Circuit Analysis Lab Manual", type: "PDF", size: "4.5 MB", date: "2026-03-03" },
];

const StudyMaterial = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Study Material</h1>
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Subject</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Title</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Size</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Date</th>
            <th className="text-left px-6 py-3 font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.title} className="border-b border-border last:border-0 hover:bg-secondary/30">
              <td className="px-6 py-4 text-foreground">{m.subject}</td>
              <td className="px-6 py-4 text-foreground">{m.title}</td>
              <td className="px-6 py-4 font-mono-data text-muted-foreground">{m.type}</td>
              <td className="px-6 py-4 font-mono-data text-muted-foreground">{m.size}</td>
              <td className="px-6 py-4 font-mono-data text-muted-foreground">{m.date}</td>
              <td className="px-6 py-4">
                <button className="flex items-center gap-1.5 text-primary hover:underline text-sm">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default StudyMaterial;
