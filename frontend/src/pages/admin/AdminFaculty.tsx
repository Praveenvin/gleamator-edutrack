import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const faculty = [
  { id: "FAC101", name: "Dr. Sarah Wilson", dept: "CS", courses: 3, email: "wilson@uni.edu" },
  { id: "FAC102", name: "Dr. Ramesh Rao", dept: "ECE", courses: 4, email: "rao@uni.edu" },
  { id: "FAC103", name: "Dr. Amit Singh", dept: "Mech", courses: 2, email: "singh@uni.edu" },
  { id: "FAC104", name: "Dr. Neha Gupta", dept: "IT", courses: 3, email: "gupta@uni.edu" },
];

const AdminFaculty = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Faculty Management</h1>
    <div className="bg-card rounded-lg border border-border p-6">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["ID", "Name", "Department", "Courses", "Email"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {faculty.map(f => (
            <tr key={f.id} className="border-b border-border last:border-0">
              <td className="py-2.5 font-mono-data text-primary">{f.id}</td>
              <td className="py-2.5 text-foreground">{f.name}</td>
              <td className="py-2.5 text-muted-foreground">{f.dept}</td>
              <td className="py-2.5 font-mono-data text-foreground">{f.courses}</td>
              <td className="py-2.5 text-muted-foreground">{f.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminDashboardLayout>
);

export default AdminFaculty;
