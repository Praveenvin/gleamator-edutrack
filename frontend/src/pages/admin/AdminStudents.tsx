import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const students = [
  { id: "STU2547", name: "Arun Kumar", dept: "CS", year: "3rd", email: "arun@uni.edu", status: "Active" },
  { id: "STU2546", name: "Priya Sharma", dept: "ECE", year: "2nd", email: "priya@uni.edu", status: "Active" },
  { id: "STU2545", name: "Rahul Verma", dept: "Mech", year: "4th", email: "rahul@uni.edu", status: "Active" },
  { id: "STU2544", name: "Sneha Patel", dept: "IT", year: "1st", email: "sneha@uni.edu", status: "Active" },
  { id: "STU2543", name: "Vikram Singh", dept: "CS", year: "3rd", email: "vikram@uni.edu", status: "Inactive" },
];

const AdminStudents = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Students Management</h1>
    <div className="bg-card rounded-lg border border-border p-6">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border">
          {["ID", "Name", "Dept", "Year", "Email", "Status"].map(h => (
            <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-b border-border last:border-0">
              <td className="py-2.5 font-mono-data text-primary">{s.id}</td>
              <td className="py-2.5 text-foreground">{s.name}</td>
              <td className="py-2.5 text-muted-foreground">{s.dept}</td>
              <td className="py-2.5 text-muted-foreground">{s.year}</td>
              <td className="py-2.5 text-muted-foreground">{s.email}</td>
              <td className="py-2.5">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === "Active" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>{s.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminDashboardLayout>
);

export default AdminStudents;
