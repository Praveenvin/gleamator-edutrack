import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const courses = [
  { code: "CS301", name: "Data Structures", dept: "CS", faculty: "Dr. Wilson", students: 48 },
  { code: "CS302", name: "Operating Systems", dept: "CS", faculty: "Dr. Wilson", students: 45 },
  { code: "ECE201", name: "Digital Electronics", dept: "ECE", faculty: "Dr. Rao", students: 52 },
  { code: "ME201", name: "Thermodynamics", dept: "Mech", faculty: "Dr. Singh", students: 40 },
  { code: "IT301", name: "Web Technologies", dept: "IT", faculty: "Dr. Gupta", students: 38 },
];

const AdminCourses = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Courses Management</h1>
    <div className="bg-card rounded-lg border border-border p-6">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["Code", "Course Name", "Dept", "Faculty", "Students"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.code} className="border-b border-border last:border-0">
              <td className="py-2.5 font-mono-data text-primary">{c.code}</td>
              <td className="py-2.5 text-foreground">{c.name}</td>
              <td className="py-2.5 text-muted-foreground">{c.dept}</td>
              <td className="py-2.5 text-muted-foreground">{c.faculty}</td>
              <td className="py-2.5 font-mono-data text-foreground">{c.students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminDashboardLayout>
);

export default AdminCourses;
