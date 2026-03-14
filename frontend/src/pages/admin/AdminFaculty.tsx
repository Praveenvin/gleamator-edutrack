import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Faculty {
  id?: number;
  name: string;
  department: string;
  designation: string;
  email: string;
}

const API = "http://127.0.0.1:8000/api/faculty/";

const AdminFaculty = () => {

  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<Faculty>({
    name: "",
    department: "",
    designation: "",
    email: ""
  });

  const fetchFaculty = async () => {
    try {
      const res = await axios.get(API);
      setFaculty(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAdd = () => {
    setEditing(false);
    setForm({
      name: "",
      department: "",
      designation: "",
      email: ""
    });
    setShowModal(true);
  };

  const openEdit = (f: Faculty) => {
    setEditing(true);
    setForm(f);
    setShowModal(true);
  };

  const saveFaculty = async () => {

    try {

      if (editing) {
        await axios.put(`${API}${form.id}/`, form);
      } else {
        await axios.post(API, form);
      }

      setShowModal(false);
      fetchFaculty();

    } catch (error) {
      console.error(error);
    }

  };

  const deleteFaculty = async (id?: number) => {

    if (!confirm("Delete this faculty member?")) return;

    try {
      await axios.delete(`${API}${id}/`);
      fetchFaculty();
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Faculty Management
      </h1>

      <div className="bg-card rounded-lg border border-border p-6">

        <div className="flex justify-between mb-4">

          <input
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border px-3 py-2 rounded text-sm"
          />

          <button
            onClick={openAdd}
            className="bg-primary text-white px-4 py-2 rounded text-sm"
          >
            Add Faculty
          </button>

        </div>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              {["ID", "Name", "Department", "Courses", "Email", "Actions"].map(h => (
                <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>

            {filteredFaculty.map(f => (

              <tr key={f.id} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono-data text-primary">
                  FAC{f.id?.toString().padStart(3,"0")}
                </td>

                <td className="py-2.5 text-foreground">{f.name}</td>

                <td className="py-2.5 text-muted-foreground">{f.department}</td>

                <td className="py-2.5 font-mono-data text-foreground">—</td>

                <td className="py-2.5 text-muted-foreground">{f.email}</td>

                <td className="py-2.5 flex gap-2">

                  <button
                    onClick={() => openEdit(f)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFaculty(f.id)}
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

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Faculty" : "Add Faculty"}
            </h2>

            <div className="flex flex-col gap-3">

              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="designation"
                placeholder="Designation"
                value={form.designation}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />

            </div>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveFaculty}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </AdminDashboardLayout>
  );
};

export default AdminFaculty;