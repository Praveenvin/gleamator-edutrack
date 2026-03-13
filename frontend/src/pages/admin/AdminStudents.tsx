import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  dept: string;
  year: string;
  email: string;
  status: string;
}

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/students/");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminDashboardLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Students Management
      </h1>

      <div className="bg-card rounded-lg border border-border p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Name", "Dept", "Year", "Email", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="py-2.5 font-mono-data text-primary">{s.id}</td>
                <td className="py-2.5 text-foreground">{s.name}</td>
                <td className="py-2.5 text-muted-foreground">{s.dept}</td>
                <td className="py-2.5 text-muted-foreground">{s.year}</td>
                <td className="py-2.5 text-muted-foreground">{s.email}</td>

                <td className="py-2.5">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      s.status === "Active"
                        ? "text-success bg-success/10"
                        : "text-destructive bg-destructive/10"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminStudents;