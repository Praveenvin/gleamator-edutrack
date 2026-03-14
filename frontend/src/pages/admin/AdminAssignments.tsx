import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Assignment {
  id: number;
  title: string;
  course: number;
  description: string;
  due_date: string;
  created_at?: string;
}

const statusStyle: Record<string, string> = {
  Active: "text-success bg-success/10",
  Closed: "text-muted-foreground bg-secondary",
};

const API = "http://127.0.0.1:8000/api/assignments/";

const AdminAssignments = () => {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<Assignment>({
    id: 0,
    title: "",
    course: 1,
    description: "",
    due_date: "",
  });

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(API);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAdd = () => {
    setEditing(false);
    setForm({
      id: 0,
      title: "",
      course: 1,
      description: "",
      due_date: "",
    });
    setShowModal(true);
  };

  const openEdit = (a: Assignment) => {
    setEditing(true);
    setForm(a);
    setShowModal(true);
  };

  const saveAssignment = async () => {
    try {
      if (editing) {
        await axios.put(`${API}${form.id}/`, form);
      } else {
        await axios.post(API, form);
      }

      setShowModal(false);
      fetchAssignments();

    } catch (error) {
      console.error(error);
    }
  };

  const deleteAssignment = async (id: number) => {
    if (!confirm("Delete this assignment?")) return;

    try {
      await axios.delete(`${API}${id}/`);
      fetchAssignments();
    } catch (error) {
      console.error(error);
    }
  };

  const totalAssignments = assignments.length;

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Assignments Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: "Total Assignments", value: totalAssignments },
          { label: "Active", value: totalAssignments },
          { label: "Avg Submission Rate", value: "—" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <div className="flex justify-between mb-4">

          <input
            placeholder="Search assignment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border px-3 py-2 rounded text-sm"
          />

          <button
            onClick={openAdd}
            className="bg-primary text-white px-4 py-2 rounded text-sm"
          >
            Add Assignment
          </button>

        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">
          All Assignments
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              {["ID", "Title", "Course", "Faculty", "Due Date", "Submissions", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left py-2 text-muted-foreground font-medium"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>

            {filteredAssignments.map((a) => (

              <tr key={a.id} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono text-primary text-xs">
                  ASG{a.id.toString().padStart(3, "0")}
                </td>

                <td className="py-2.5 text-foreground">{a.title}</td>

                <td className="py-2.5 text-muted-foreground">{a.course}</td>

                <td className="py-2.5 text-muted-foreground">—</td>

                <td className="py-2.5 text-muted-foreground">{a.due_date}</td>

                <td className="py-2.5 text-foreground">—</td>

                <td className="py-2.5">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle["Active"]}`}
                  >
                    Active
                  </span>
                </td>

                <td className="py-2.5 flex gap-2">

                  <button
                    onClick={() => openEdit(a)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAssignment(a.id)}
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
              {editing ? "Edit Assignment" : "Add Assignment"}
            </h2>

            <div className="flex flex-col gap-3">

              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="course"
                placeholder="Course ID"
                value={form.course}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="due_date"
                type="date"
                value={form.due_date}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
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
                onClick={saveAssignment}
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

export default AdminAssignments;