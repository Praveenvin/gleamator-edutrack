import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X, Search, Clock } from "lucide-react";
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
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [facultySubmissions, setFacultySubmissions] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [selectAll, setSelectAll] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    due_date: "",
    faculty: [] as number[],
  });
  const fetchFacultySubmissions = async (assignmentId: number) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/assignment-submissions/?assignment=${assignmentId}&type=faculty`
    );

    setFacultySubmissions(res.data);
    setSelectedAssignment(assignmentId);

  } catch (err) {
    console.error("Error fetching faculty submissions", err);
  }
};
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
  useEffect(() => {
  fetchAssignments()
  fetchFaculty()

  const stored = localStorage.getItem("assignment_search_history")
  if (stored) {
    setSearchHistory(JSON.parse(stored))
  }
}, [])
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])
  const saveSearch = (value: string) => {
  if (!value.trim()) return

  let updated = [value, ...searchHistory.filter(v => v !== value)]
  updated = updated.slice(0, 5)

  setSearchHistory(updated)
  localStorage.setItem("assignment_search_history", JSON.stringify(updated))
}
  const suggestions = assignments
  .filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )
  .slice(0, 5)
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
  const toggleSelect = (id:number)=>{
  setSelectedIds(prev =>
    prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
  );
};

const toggleSelectAll = ()=>{
  if(selectedIds.length === filtered.length){
    setSelectedIds([]);
  } else {
    setSelectedIds(filtered.map(a => a.id));
  }
};

const confirmBulkDelete = async ()=>{
  try{
    await Promise.all(
      selectedIds.map(id => axios.delete(`${API}${id}/`))
    );

    setSelectedIds([]);
    setBulkDeleteMode(false);
    fetchAssignments();

    setMessage("Selected assignments deleted successfully");

  }catch{
    setMessage("Error deleting selected assignments");
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

        <div ref={searchRef} className="relative w-[250px]">

  <input
    placeholder="Search assignments..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value)
      setShowDropdown(true)
    }}
    onFocus={() => setShowDropdown(true)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        if (!search.trim()) return

        saveSearch(search)
        setShowDropdown(false)
        e.currentTarget.blur()
      }
    }}
    className="w-full border border-border px-4 py-2.5 rounded-xl text-sm 
    hover:border-primary/40 focus:outline-none focus:ring-2 
    focus:ring-primary/20 transition shadow-sm"
  />

  {showDropdown && (
    <div className="absolute w-full bg-white border border-border rounded-xl shadow-lg mt-2 z-50 max-h-64 overflow-y-auto">

      {/* HISTORY */}
      {!search && searchHistory.length > 0 && (
        <div className="py-1">

          <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground">
            <span>Recent Searches</span>
            <button
              onClick={() => {
                localStorage.removeItem("assignment_search_history")
                setSearchHistory([])
              }}
              className="hover:text-red-500"
            >
              Clear
            </button>
          </div>

          {searchHistory.map((item, i) => (
            <div key={i} className="flex justify-between px-3 py-2 hover:bg-muted/50 group">

              <div
                onClick={() => {
                  setSearch(item)
                  saveSearch(item)
                  setShowDropdown(false)
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Clock size={14} />
                {item}
              </div>

              <X
                size={14}
                onClick={(e) => {
                  e.stopPropagation()
                  const updated = searchHistory.filter((_, idx) => idx !== i)
                  setSearchHistory(updated)
                  localStorage.setItem("assignment_search_history", JSON.stringify(updated))
                }}
                className="opacity-0 group-hover:opacity-100 cursor-pointer"
              />

            </div>
          ))}
        </div>
      )}

      {/* SUGGESTIONS */}
      {search && suggestions.map((a, i) => (
        <div
          key={i}
          onClick={() => {
            setSearch(a.title)
            saveSearch(a.title)
            setShowDropdown(false)
          }}
          className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 cursor-pointer"
        >
          <Search size={14} />
          {a.title}
        </div>
      ))}

    </div>
  )}

</div>
        {!selectMode ? (
  <button
    onClick={()=>{
      setSelectMode(true);
      setSelectedIds([]);
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    border border-border bg-background 
    hover:bg-primary/10 hover:text-primary hover:border-primary/40"
  >
    Select
  </button>
) : (
  <button
    onClick={()=>{
      setSelectMode(false);
      setSelectedIds([]);
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    border border-border bg-red-50 text-red-600 
    hover:bg-red-100"
  >
    Cancel Selection
  </button>
)}

{selectMode && selectedIds.length > 0 && (
  <button
    onClick={()=>setBulkDeleteMode(true)}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    bg-red-600 text-white hover:bg-red-700"
  >
    Delete Selected ({selectedIds.length})
  </button>
)}
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

  {selectMode && (
    <th className="px-4 py-3 text-center">
      <input
        type="checkbox"
        checked={selectedIds.length === filtered.length && filtered.length > 0}
        onChange={toggleSelectAll}
      />
    </th>
  )}

  {["ID","Title","Faculty","File","Due Date","Actions"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
  <tr>
    <td colSpan={selectMode ? 7 : 6} className="text-center py-4 text-muted-foreground">
      No assignments found
    </td>
  </tr>
)}
            {filtered.map(a=>(
              <tr key={a.id} className={`border-t border-border hover:bg-secondary/40 transition ${
  selectedIds.includes(a.id) ? "bg-blue-50" : ""
}`}>
                {selectMode && (
  <td className="px-4 py-3 text-center">
    <input
      type="checkbox"
      checked={selectedIds.includes(a.id)}
      onChange={()=>toggleSelect(a.id)}
    />
  </td>
)}
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
            {/* FACULTY SUBMISSIONS */}

<div className="mt-10">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-lg font-semibold">
      Faculty Submissions
    </h2>

    <select
      className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary 
      hover:border-primary/40 transition cursor-pointer"
      onChange={(e) => fetchFacultySubmissions(Number(e.target.value))}
      defaultValue=""
    >
      <option value="" disabled>Select Assignment</option>

      {assignments.map(a => (
        <option key={a.id} value={a.id}>
          {a.title}
        </option>
      ))}

    </select>

  </div>

  <div className="bg-card rounded-lg border border-border overflow-hidden">

    <table className="w-full text-sm">

      <thead className="bg-secondary/50">
        <tr>
          {["Faculty","Status","File","Date"].map(h=>(
            <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>

        {facultySubmissions.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-6 text-muted-foreground">
              Select an assignment to view submissions
            </td>
          </tr>
        ) : (

          facultySubmissions.map((f,index)=>(

            <tr
              key={index}
              className="border-t border-border hover:bg-secondary/40 transition"
            >

              <td className="px-4 py-3 font-medium">
                {f.name}
              </td>

              <td className="px-4 py-3">

                <span className={`px-2 py-1 text-xs rounded-full ${
                 f.submitted
                   ? "bg-green-100 text-green-600"
                   : "bg-gray-100 text-muted-foreground"
                }`}>
                  {f.submitted ? "Submitted" : "Pending"}
                </span>

              </td>

              <td className="px-4 py-3 flex gap-2">

  {f.submitted && f.file ? (
    <>
      <a
        href={`http://127.0.0.1:8000${f.file}`}
        target="_blank"
        className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary"
      >
        View
      </a>

      <a
        href={`http://127.0.0.1:8000${f.file}`}
        download
        className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white"
      >
        Download
      </a>
    </>
  ) : (
    <span className="text-xs text-muted-foreground">
      Not Available
    </span>
  )}

</td>

              <td className="px-4 py-3 text-xs">

  {f.submitted ? (
    <span className="text-muted-foreground">
      {new Date(f.submitted_at).toLocaleDateString()}
    </span>
  ) : (
    <span className="text-muted-foreground">-</span>
  )}

</td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

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
        {bulkDeleteMode && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[360px] text-center shadow-lg">

      <h2 className="text-lg font-semibold mb-2 text-red-600">
        Bulk Delete
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Delete {selectedIds.length} assignments?
      </p>

      <div className="flex justify-center gap-4">

        <button
          onClick={()=>setBulkDeleteMode(false)}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          Cancel
        </button>

        <button
          onClick={confirmBulkDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Delete All
        </button>

      </div>

    </div>

  </div>
)}
    </AdminDashboardLayout>
  );
};

export default AdminAssignments;