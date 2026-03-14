import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  id?: number;
  course_name: string;
  course_code: string;
  department: string;
  faculty: number;
  semester: number;
}

const API = "http://127.0.0.1:8000/api/courses/";

const AdminCourses = () => {

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<Course>({
    course_name: "",
    course_code: "",
    department: "",
    faculty: 1,
    semester: 1
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get(API);
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.course_name.toLowerCase().includes(search.toLowerCase())
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
      course_name: "",
      course_code: "",
      department: "",
      faculty: 1,
      semester: 1
    });
    setShowModal(true);
  };

  const openEdit = (course: Course) => {
    setEditing(true);
    setForm(course);
    setShowModal(true);
  };

  const saveCourse = async () => {

    try {

      if (editing) {
        await axios.put(`${API}${form.id}/`, form);
      } else {
        await axios.post(API, form);
      }

      setShowModal(false);
      fetchCourses();

    } catch (error) {
      console.error(error);
    }

  };

  const deleteCourse = async (id?: number) => {

    if (!confirm("Delete this course?")) return;

    try {
      await axios.delete(`${API}${id}/`);
      fetchCourses();
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Courses Management
      </h1>

      <div className="bg-card rounded-lg border border-border p-6">

        <div className="flex justify-between mb-4">

          <input
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border px-3 py-2 rounded text-sm"
          />

          <button
            onClick={openAdd}
            className="bg-primary text-white px-4 py-2 rounded text-sm"
          >
            Add Course
          </button>

        </div>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">

              {["Code", "Course Name", "Dept", "Faculty", "Students", "Actions"].map(h => (
                <th key={h} className="text-left py-2 text-muted-foreground font-medium">
                  {h}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {filteredCourses.map(c => (

              <tr key={c.course_code} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono-data text-primary">
                  {c.course_code}
                </td>

                <td className="py-2.5 text-foreground">
                  {c.course_name}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {c.department}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {c.faculty}
                </td>

                <td className="py-2.5 font-mono-data text-foreground">
                  —
                </td>

                <td className="py-2.5 flex gap-2">

                  <button
                    onClick={() => openEdit(c)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCourse(c.id)}
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
              {editing ? "Edit Course" : "Add Course"}
            </h2>

            <div className="flex flex-col gap-3">

              <input
                name="course_code"
                placeholder="Course Code"
                value={form.course_code}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="course_name"
                placeholder="Course Name"
                value={form.course_name}
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
                name="faculty"
                placeholder="Faculty ID"
                value={form.faculty}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="semester"
                placeholder="Semester"
                value={form.semester}
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
                onClick={saveCourse}
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

export default AdminCourses;