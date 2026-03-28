import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Upload, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Search, Clock } from "lucide-react";
import axios from "axios";
import { Pencil, Trash2, Eye } from "lucide-react";
interface Material {
  id: number;
  title: string;
  course: number;
  course_name?: string;
  file: string;
  created_at?: string;
}

interface Course {
  id: number;
  course_name: string;
}

const FacultyMaterials = () => {

  const [uploads, setUploads] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [courseFilter, setCourseFilter] = useState("All");
  const searchRef = useRef<HTMLDivElement>(null);
  
  /* FETCH MATERIALS */
  const fetchMaterials = async () => {
    try {
      const facultyId = localStorage.getItem("faculty_id");

const res = await axios.get(
  "http://127.0.0.1:8000/api/materials/",
  {
    params: { faculty: facultyId }
  }
);
      setUploads(res.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  /* FETCH COURSES */
  const fetchCourses = async () => {
    try {
      const facultyId = localStorage.getItem("faculty_id");

const res = await axios.get(
  "http://127.0.0.1:8000/api/courses/",
  {
    params: { faculty: facultyId }
  }
);
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const filteredUploads = uploads
  .filter(u => {
    const courseName =
      courses.find(c => c.id === u.course)?.course_name || "";

    const matchSearch =
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      courseName.toLowerCase().includes(search.toLowerCase());

    const matchCourse =
      courseFilter === "All" ||
      String(u.course) === courseFilter;

    return matchSearch && matchCourse;
  });
  const openEdit = (item: Material) => {
  setEditing(true);
  setEditId(item.id);
  setTitle(item.title);
  setSelectedCourse(String(item.course));
};
  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  /* UPLOAD MATERIAL */
  const uploadMaterial = async () => {
  try {
    if (!selectedCourse || !title || (!file && !editing)) {
      setMessage("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("course", selectedCourse);
    formData.append("title", title);

    if (file) formData.append("file", file);

    if (editing && editId) {
      await axios.put(
        `http://127.0.0.1:8000/api/materials/${editId}/`,
        formData
      );
      setMessage("Material updated successfully");
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/materials/",
        formData
      );
      setMessage("Material uploaded successfully");
    }

    setEditing(false);
    setEditId(null);
    setTitle("");
    setFile(null);
    setSelectedCourse("");

    fetchMaterials();

  } catch {
    setMessage("Error saving material");
  }
};
  const confirmDelete = async () => {
  try {
    if (!deleteId) return;

    await axios.delete(
      `http://127.0.0.1:8000/api/materials/${deleteId}/`
    );

    setDeleteId(null);
    fetchMaterials();
    setMessage("Material deleted successfully");

  } catch {
    setMessage("Error deleting material");
  }
};
  useEffect(() => {
  const stored = localStorage.getItem("material_search_history");
  if (stored) {
    setSearchHistory(JSON.parse(stored));
  }
}, []);
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const saveSearch = (value: string) => {
  if (!value.trim()) return;

  let updated = [value, ...searchHistory.filter(v => v !== value)];
  updated = updated.slice(0, 5);

  setSearchHistory(updated);
  localStorage.setItem("material_search_history", JSON.stringify(updated));
};

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Upload Study Materials
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* UPLOAD SECTION */}
        <div className="lg:col-span-1 bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold mb-4">
            Upload New Material
          </h2>

          <div className="space-y-4">

            {/* COURSE */}
            <div>
              <label className="text-sm text-muted-foreground">Course</label>
              <select
                value={selectedCourse}
                onChange={(e)=>setSelectedCourse(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="">Select Course</option>

                {courses.map(c=>(
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="Enter material title"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            {/* FILE UPLOAD (STYLED) */}
            <div className="border border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition">

              <input
                type="file"
                className="hidden"
                id="materialUpload"
                onChange={(e)=>setFile(e.target.files?.[0] || null)}
              />

              {!file ? (
                <label htmlFor="materialUpload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload file
                  </p>
                </label>
              ) : (
                <div className="flex justify-between items-center bg-secondary/40 px-4 py-3 rounded-lg">
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={()=>setFile(null)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

            </div>

            {/* BUTTON */}
            <button
              onClick={uploadMaterial}
              className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            >
              Upload Material
            </button>

          </div>
        </div>

        <div className="lg:col-span-2">

  {/* MESSAGE */}
  {message && (
    <div className={`mb-4 px-4 py-2 rounded-lg text-sm flex justify-between ${
      message.includes("Error")
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}>
      {message}
      <button onClick={()=>setMessage(null)}>✕</button>
    </div>
  )}

  {/* SEARCH + FILTER */}
  <div className="flex items-center gap-4 mb-4">

    {/* SEARCH */}
    <div ref={searchRef} className="relative w-[250px]">

      <input
        placeholder="Search materials..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!search.trim()) return;
            saveSearch(search);
            setShowDropdown(false);
          }
        }}
        className="w-full border border-border px-4 py-2.5 pl-10 rounded-lg text-sm 
        hover:border-primary/40 focus:outline-none focus:ring-2 
        focus:ring-primary/20 transition"
      />

      {/* ICON */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute w-full bg-white border border-border rounded-xl shadow-lg mt-2 z-50 max-h-64 overflow-y-auto">

          {/* HISTORY */}
          {!search && searchHistory.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Recent Searches
              </div>

              {searchHistory.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearch(item);
                    saveSearch(item);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 cursor-pointer"
                >
                  <Clock size={14} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </>
          )}

          {/* SUGGESTIONS */}
          {search && filteredUploads.slice(0,5).map((u,i)=>(
            <div
              key={i}
              onClick={() => {
                setSearch(u.title);
                saveSearch(u.title);
                setShowDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 cursor-pointer"
            >
              <Search size={14}/>
              <span className="text-sm">{u.title}</span>
            </div>
          ))}

          {/* EMPTY */}
          {search && filteredUploads.length === 0 && (
            <div className="px-3 py-3 text-sm text-muted-foreground text-center">
              No results found
            </div>
          )}

        </div>
      )}

    </div>

    {/* COURSE FILTER */}
    <select
      value={courseFilter}
      onChange={(e)=>setCourseFilter(e.target.value)}
      className="border border-border px-3 py-2.5 rounded-lg text-sm 
      hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
    >
      <option value="All">All Subjects</option>

      {courses.map(c=>(
        <option key={c.id} value={c.id}>
          {c.course_name}
        </option>
      ))}
    </select>

  </div>

  {/* TABLE */}
  <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

    <table className="w-full text-sm">

      <thead>
        <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <th className="px-4 py-3 text-left">Title</th>
          <th className="px-4 py-3 text-left">Course</th>
          <th className="px-4 py-3 text-left">Type</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>

        {filteredUploads.map((u) => {

          const fileType = u.file?.split(".").pop()?.toUpperCase();
          const courseName =
            courses.find(c => c.id === u.course)?.course_name || u.course;

          return (
            <tr
              key={u.id}
              className="border-b border-border hover:bg-gray-50 transition"
            >

              <td className="px-4 py-3 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <span className="font-medium">{u.title}</span>
              </td>

              <td className="px-4 py-3">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {courseName}
                </span>
              </td>

              <td className="px-4 py-3">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {fileType}
                </span>
              </td>

              <td className="px-4 py-3 text-right flex justify-end gap-2">

  {/* VIEW */}
  <a
    href={u.file}
    target="_blank"
    className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md 
    bg-primary/10 text-primary hover:bg-primary/20 transition"
  >
    View
  </a>

  {/* EDIT */}
  <button
    onClick={() => openEdit(u)}
    className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition"
  >
    <Pencil size={16} />
  </button>

  {/* DELETE */}
  <button
    onClick={() => setDeleteId(u.id)}
    className="p-1.5 rounded text-red-600 hover:bg-red-100 transition"
  >
    <Trash2 size={16} />
  </button>

</td>

            </tr>
          );
        })}

      </tbody>

    </table>
  </div>

  {/* DELETE POPUP */}
  {deleteId && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-[320px] text-center">

        <p className="mb-4 text-sm">
          Delete this material?
        </p>

        <div className="flex justify-center gap-4">
          <button onClick={()=>setDeleteId(null)}>Cancel</button>
          <button
            onClick={confirmDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  )}

</div>
      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyMaterials;