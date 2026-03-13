import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { FileText } from "lucide-react";

const materials = [
  { id: 1, title: "Data Structures Notes", course: "CS301", faculty: "Dr. Wilson", type: "PDF", size: "2.4 MB", date: "2025-03-12", downloads: 128 },
  { id: 2, title: "Digital Electronics Lab Manual", course: "ECE201", faculty: "Dr. Rao", type: "PDF", size: "5.1 MB", date: "2025-03-10", downloads: 96 },
  { id: 3, title: "Thermodynamics Formulas", course: "ME201", faculty: "Dr. Singh", type: "PDF", size: "1.2 MB", date: "2025-03-08", downloads: 74 },
  { id: 4, title: "Web Technologies Slides", course: "IT301", faculty: "Dr. Gupta", type: "PPTX", size: "8.3 MB", date: "2025-03-06", downloads: 112 },
  { id: 5, title: "OS Concepts Video Lecture", course: "CS302", faculty: "Dr. Wilson", type: "MP4", size: "45 MB", date: "2025-03-04", downloads: 203 },
];

const AdminMaterials = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Study Materials Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {[
        { label: "Total Materials", value: "156" },
        { label: "Total Downloads", value: "4,280" },
        { label: "Storage Used", value: "2.3 GB" },
      ].map(s => (
        <div key={s.label} className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
        </div>
      ))}
    </div>
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Uploaded Materials</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["Title", "Course", "Faculty", "Type", "Size", "Date", "Downloads"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {materials.map(m => (
            <tr key={m.id} className="border-b border-border last:border-0">
              <td className="py-2.5 text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{m.title}</td>
              <td className="py-2.5 text-muted-foreground">{m.course}</td>
              <td className="py-2.5 text-muted-foreground">{m.faculty}</td>
              <td className="py-2.5"><span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">{m.type}</span></td>
              <td className="py-2.5 text-muted-foreground">{m.size}</td>
              <td className="py-2.5 text-muted-foreground">{m.date}</td>
              <td className="py-2.5 text-foreground">{m.downloads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminDashboardLayout>
);

export default AdminMaterials;
