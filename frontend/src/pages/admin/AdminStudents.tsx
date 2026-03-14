import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  usn: string;
  department: string;
  email: string;
  phone: string;
  year: number;
  status: string;
}

const API = "http://127.0.0.1:8000/api/students/";

const AdminStudents = () => {

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  const [editingStudent,setEditingStudent] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: "",
    usn: "",
    department: "",
    email: "",
    phone: "",
    year: 1,
    status: "Active"
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.usn.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = async () => {
    try {
      await axios.post(API, form);
      fetchStudents();

      setForm({
        name: "",
        usn: "",
        department: "",
        email: "",
        phone: "",
        year: 1,
        status: "Active"
      });

    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const deleteStudent = async (id:number) => {

    if(!confirm("Delete this student?")) return;

    try{
      await axios.delete(`${API}${id}/`);
      fetchStudents();
    }
    catch(err){
      console.error(err);
    }

  };

  const startEdit = (student:Student) => {

    setEditingStudent(student);

    setForm({
      name: student.name,
      usn: student.usn,
      department: student.department,
      email: student.email,
      phone: student.phone,
      year: student.year,
      status: student.status
    });

  };

  const updateStudent = async () => {

    if(!editingStudent) return;

    try{

      await axios.put(`${API}${editingStudent.id}/`,form);

      setEditingStudent(null);
      fetchStudents();

    }
    catch(err){
      console.error(err);
    }

  };

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Students Management
      </h1>

      <div className="mb-4">
        <input
          placeholder="Search by name or USN..."
          className="border border-border px-3 py-2 rounded text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">

        <div className="grid grid-cols-3 gap-3">

          <input name="name" placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-border px-3 py-2 rounded text-sm" />

          <input name="usn" placeholder="USN"
            value={form.usn}
            onChange={handleChange}
            className="border border-border px-3 py-2 rounded text-sm" />

          <input name="department" placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="border border-border px-3 py-2 rounded text-sm" />

          <input name="email" placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-border px-3 py-2 rounded text-sm" />

          <input name="phone" placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border border-border px-3 py-2 rounded text-sm" />

          <input name="year" type="number" placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="border border-border px-3 py-2 rounded text-sm" />

        </div>

        {!editingStudent ? (

          <button
            onClick={addStudent}
            className="mt-4 bg-primary text-white px-4 py-2 rounded text-sm"
          >
            Add Student
          </button>

        ) : (

          <button
            onClick={updateStudent}
            className="mt-4 bg-primary text-white px-4 py-2 rounded text-sm"
          >
            Update Student
          </button>

        )}

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-border">

              {["ID","USN","Name","Department","Year","Email","Status","Actions"].map((h)=>(
                <th key={h} className="text-left py-2 text-muted-foreground font-medium">
                  {h}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {filteredStudents.map((s)=>(
              <tr key={s.id} className="border-b border-border last:border-0">

                <td className="py-2.5 text-primary">{s.id}</td>
                <td className="py-2.5 text-foreground">{s.usn}</td>
                <td className="py-2.5 text-foreground">{s.name}</td>
                <td className="py-2.5 text-muted-foreground">{s.department}</td>
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

                <td className="py-2.5 flex gap-2">

                  <button
                    onClick={()=>startEdit(s)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteStudent(s.id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>

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