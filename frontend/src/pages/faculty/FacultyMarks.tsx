import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useState } from "react";

const studentsMarks = [
  { id: "STU2547", name: "Arun Kumar", test1: 42, test2: 38, test3: 45, total: "125/150" },
  { id: "STU2546", name: "Priya Sharma", test1: 48, test2: 46, test3: 44, total: "138/150" },
  { id: "STU2545", name: "Rahul Verma", test1: 35, test2: 32, test3: 38, total: "105/150" },
  { id: "STU2544", name: "Sneha Patel", test1: 44, test2: 42, test3: 47, total: "133/150" },
  { id: "STU2543", name: "Vikram Singh", test1: 30, test2: 28, test3: 35, total: "93/150" },
  { id: "STU2542", name: "Anita Das", test1: 46, test2: 44, test3: 48, total: "138/150" },
];

const FacultyMarks = () => {
  const [selectedCourse, setSelectedCourse] = useState("CS301");

  return (
    <FacultyDashboardLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Internal Marks</h1>
      <div className="flex items-center gap-4 mb-6">
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm">
          <option value="CS301">CS301 - Data Structures</option>
          <option value="CS302">CS302 - Operating Systems</option>
          <option value="CS401">CS401 - Machine Learning</option>
        </select>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">+ Add Marks</button>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["ID", "Student Name", "Test 1 (50)", "Test 2 (50)", "Test 3 (50)", "Total (150)"].map(h => (
              <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {studentsMarks.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="py-2.5 font-mono text-primary text-xs">{s.id}</td>
                <td className="py-2.5 text-foreground">{s.name}</td>
                <td className="py-2.5 text-foreground">{s.test1}</td>
                <td className="py-2.5 text-foreground">{s.test2}</td>
                <td className="py-2.5 text-foreground">{s.test3}</td>
                <td className="py-2.5 font-medium text-foreground">{s.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FacultyDashboardLayout>
  );
};

export default FacultyMarks;
