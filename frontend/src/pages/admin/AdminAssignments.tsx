import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  faculty: number[];
  faculty_names?: string[];
  file_url?: string;
}

interface Faculty {
  id: number;
  name: string;
}

const API = "http://127.0.0.1:8000/api/assignments/";
const FACULTY_API = "http://127.0.0.1:8000/api/faculty/";

const AdminAssignments = () => {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [selectAll, setSelectAll] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    due_date: "",
    faculty: [] as number[],
  });

  /* FETCH */

  const fetchAssignments = async () => {
    const res = await axios.get(API);
    setAssignments(res.data);
  };

  const fetchFaculty = async () => {
    const res = await axios.get(FACULTY_API);
    setFacultyList(res.data);
  };

  useEffect(() => {
    fetchAssignments();
    fetchFaculty();
  }, []);

  /* FILTER */

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  /* HANDLERS */

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleFaculty = (id: number) => {
    if (form.faculty.includes(id)) {
      setForm({ ...form, faculty: form.faculty.filter(f => f !== id) });
    } else {
      setForm({ ...form, faculty: [...form.faculty, id] });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setForm({ ...form, faculty: [] });
      setSelectAll(false);
    } else {
      setForm({ ...form, faculty: facultyList.map(f => f.id) });
      setSelectAll(true);
    }
  };

  const openAdd = () => {
    setEditing(false);
    setFormError(null);
    setFile(null);
    setSelectAll(false);
    setForm({
      id: 0,
      title: "",
      description: "",
      due_date: "",
      faculty: [],
    });
    setShowModal(true);
  };

  const openEdit = (a: Assignment) => {
    setEditing(true);
    setFormError(null);
    setFile(null);
    setForm({
      ...a,
      faculty: a.faculty || [],
    });
    setShowModal(true);
  };

  /* SAVE */

  const saveAssignment = async () => {

    if (!form.title || !form.due_date || form.faculty.length === 0) {
      setFormError("All fields are required");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("due_date", form.due_date);

      form.faculty.forEach(f =>
        formData.append("faculty", f.toString())
      );

      if (file) {
        formData.append("file", file);
      }

      if (editing) {
        await axios.put(`${API}${form.id}/`, formData);
        setMessage("Assignment updated successfully");
      } else {
        await axios.post(API, formData);
        setMessage("Assignment added successfully");
      }

      setShowModal(false);
      fetchAssignments();

    } catch (err:any) {
      setFormError(
        err.response?.data?.error ||
        "Error saving assignment"
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await axios.delete(`${API}${deleteId}/`);
    setDeleteId(null);
    fetchAssignments();
    setMessage("Assignment deleted successfully");
  };

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Assignments Management
      </h1>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg text-sm flex justify-between items-center bg-green-100 text-green-700">
          {message}
          <button onClick={()=>setMessage(null)}>✕</button>
        </div>
      )}

      {/* FILTER */}

      <div className="flex flex-wrap items-center gap-4 mb-6">

        <input
          placeholder="Search assignments..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border border-border px-4 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
        />

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition"
        >
          <Plus size={18}/>
          Add Assignment
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-card rounded-lg border border-border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-secondary/50">
            <tr>
              {["ID","Title","Faculty","File","Due Date","Actions"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map(a=>(
              <tr key={a.id} className="border-t border-border hover:bg-secondary/40 transition">

                <td className="px-4 py-3 text-primary">{a.id}</td>
                <td className="px-4 py-3 font-medium">{a.title}</td>

                <td className="px-4 py-3 text-muted-foreground">
                  {a.faculty_names?.join(", ") || "-"}
                </td>

                <td className="px-4 py-3">
                  {a.file_url ? (
                    <button
                      onClick={()=>{
                        setSelected(a);
                        setViewModal(true);
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
                    >
                      View File
                    </button>
                  ) : "-"}
                </td>

                <td className="px-4 py-3">{a.due_date}</td>

                <td className="px-4 py-3 flex gap-2">

                  <button
                    onClick={()=>openEdit(a)}
                    className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Pencil size={16}/>
                  </button>

                  <button
                    onClick={()=>setDeleteId(a.id)}
                    className="p-1.5 rounded text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={16}/>
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ADD/EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[420px]">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                {editing ? "Edit Assignment" : "Add Assignment"}
              </h2>
              <button onClick={()=>setShowModal(false)}>
                <X size={18}/>
              </button>
            </div>

            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3">

              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border px-3 py-2 rounded-lg text-sm"/>

              <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="border px-3 py-2 rounded-lg text-sm"/>

              {/* UPLOAD UI */}
              <div className="border border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition">

                <input
                  type="file"
                  onChange={(e)=>setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="fileUpload"
                />

                {!file ? (
                  <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">↑</div>
                    <p className="text-sm text-muted-foreground">Click to upload file</p>
                    <p className="text-xs text-muted-foreground">Supports all file types</p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-secondary/40 px-4 py-3 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={()=>setFile(null)} className="text-red-600 text-xs hover:underline">Remove</button>
                  </div>
                )}

              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll}/>
                Assign to All Faculty
              </label>

              <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                {facultyList.map(f=>(
                  <label key={f.id} className="flex items-center gap-2 text-sm py-1">
                    <input
                      type="checkbox"
                      checked={form.faculty.includes(f.id)}
                      onChange={()=>toggleFaculty(f.id)}
                    />
                    {f.name}
                  </label>
                ))}
              </div>

              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border px-3 py-2 rounded-lg text-sm"/>

            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={saveAssignment} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Save</button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW MODAL */}

      {viewModal && selected && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[520px] shadow-lg">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Assignment Details
        </h2>
        <button onClick={()=>setViewModal(false)}>
          <X size={18}/>
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4 text-sm">

        <div>
          <p className="text-muted-foreground">Title</p>
          <p className="font-medium text-foreground">{selected.title}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Faculty</p>
          <p className="text-foreground">
            {selected.faculty_names?.join(", ") || "-"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Due Date</p>
          <p className="text-foreground">{selected.due_date}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Description</p>
          <p className="text-foreground">{selected.description}</p>
        </div>

        {/* FILE SECTION */}
        {selected.file_url && (
          <div className="bg-secondary/40 border border-border rounded-lg p-4">

            <div className="flex items-center justify-between">

              {/* FILE INFO */}
              <div>
                <p className="text-sm font-medium text-foreground">
                  Attachment
                </p>
                <p className="text-xs text-muted-foreground">
                  Click preview to open in new tab
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">

                {/* PREVIEW */}
                <a
                  href={`http://127.0.0.1:8000${selected.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
                >
                  Preview
                </a>

                {/* DOWNLOAD */}
                <a
                  href={`http://127.0.0.1:8000${selected.file_url}`}
                  download
                  className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                >
                  Download
                </a>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="flex justify-end mt-6">
        <button
          onClick={()=>setViewModal(false)}
          className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition"
        >
          Close
        </button>
      </div>

    </div>

  </div>
)}

      {/* DELETE MODAL */}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[320px] text-center shadow-lg">

            <h2 className="font-semibold mb-2">Delete Assignment</h2>

            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete this assignment?
            </p>

            <div className="flex justify-center gap-4">

              <button onClick={()=>setDeleteId(null)} className="px-4 py-2 border rounded-lg text-sm">
                Cancel
              </button>

              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </AdminDashboardLayout>
  );
};

export default AdminAssignments;