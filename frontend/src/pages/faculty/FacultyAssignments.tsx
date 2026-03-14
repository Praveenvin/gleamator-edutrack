import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Assignment {
  id: number;
  title: string;
  description: string;
  course: number;
  due_date: string;
}

const API = "http://127.0.0.1:8000/api/assignments/";

const statusStyle: Record<string, string> = {
  Active: "text-success bg-success/10",
  Graded: "text-primary bg-primary/10",
};

const FacultyAssignments = () => {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: 1,
    due_date: ""
  });

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(API);
      setAssignments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createAssignment = async () => {
    try {

      await axios.post(API, form);

      setForm({
        title: "",
        description: "",
        course: 1,
        due_date: ""
      });

      setShowModal(false);

      fetchAssignments();

    } catch (error) {
      console.error(error);
    }
  };

  const openView = (a: Assignment) => {
    setSelected(a);
    setViewModal(true);
  };

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Assignments
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          + Create Assignment
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              {["ID", "Title", "Course", "Due Date", "Submissions", "Status", "Action"].map(h => (
                <th key={h} className="text-left py-2 text-muted-foreground font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {assignments.map(a => (

              <tr key={a.id} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono text-primary text-xs">
                  ASG{a.id.toString().padStart(3, "0")}
                </td>

                <td className="py-2.5 text-foreground">
                  {a.title}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {a.course}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {a.due_date}
                </td>

                <td className="py-2.5 text-foreground">
                  —
                </td>

                <td className="py-2.5">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle["Active"]}`}>
                    Active
                  </span>
                </td>

                <td className="py-2.5">
                  <button
                    onClick={() => openView(a)}
                    className="text-xs text-primary hover:underline"
                  >
                    View
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* CREATE MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              Create Assignment
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
                onClick={createAssignment}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      {/* VIEW MODAL */}

      {viewModal && selected && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              Assignment Details
            </h2>

            <div className="space-y-2 text-sm">

              <p><b>Title:</b> {selected.title}</p>
              <p><b>Course:</b> {selected.course}</p>
              <p><b>Due Date:</b> {selected.due_date}</p>
              <p><b>Description:</b> {selected.description}</p>

            </div>

            <div className="flex justify-end mt-4">

              <button
                onClick={() => setViewModal(false)}
                className="px-3 py-2 border rounded"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </FacultyDashboardLayout>
  );
};

export default FacultyAssignments;