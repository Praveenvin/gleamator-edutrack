import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Upload, FileText } from "lucide-react";

const uploads = [
  { id: 1, title: "Data Structures - Unit 1 Notes", course: "CS301", type: "PDF", size: "2.4 MB", date: "2025-03-10", downloads: 42 },
  { id: 2, title: "OS Lecture Slides Week 5", course: "CS302", type: "PPTX", size: "5.8 MB", date: "2025-03-08", downloads: 38 },
  { id: 3, title: "ML Assignment Reference", course: "CS401", type: "PDF", size: "1.1 MB", date: "2025-03-05", downloads: 28 },
];

const FacultyMaterials = () => (
  <FacultyDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Upload Study Materials</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-1 bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Upload New Material</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Course</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm">
              <option>CS301 - Data Structures</option>
              <option>CS302 - Operating Systems</option>
              <option>CS401 - Machine Learning</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Title</label>
            <input className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" placeholder="Enter material title" />
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, PPTX, DOCX up to 50MB</p>
          </div>
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Upload Material</button>
        </div>
      </div>
      <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Uploaded Materials</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["Title", "Course", "Type", "Size", "Date", "Downloads"].map(h => (
              <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {uploads.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="py-2.5 text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{u.title}</td>
                <td className="py-2.5 text-muted-foreground">{u.course}</td>
                <td className="py-2.5"><span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">{u.type}</span></td>
                <td className="py-2.5 text-muted-foreground">{u.size}</td>
                <td className="py-2.5 text-muted-foreground">{u.date}</td>
                <td className="py-2.5 text-foreground">{u.downloads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </FacultyDashboardLayout>
);

export default FacultyMaterials;
