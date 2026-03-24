import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X, Search, Clock } from "lucide-react";
interface Student {
  id:number;
  name:string;
  usn:string;
  department:string;
  email:string;
  phone:string;
  year:number;
}

const API = "http://127.0.0.1:8000/api/students/";

const departments = ["AI","CSE","ISE","ECE","MECH"];

const deptColors:Record<string,string> = {
  AI:"bg-purple-100 text-purple-700",
  CSE:"bg-blue-100 text-blue-700",
  ISE:"bg-green-100 text-green-700",
  ECE:"bg-orange-100 text-orange-700",
  MECH:"bg-gray-200 text-gray-700"
};

const yearColors:Record<number,string> = {
  1:"bg-emerald-100 text-emerald-700",
  2:"bg-blue-100 text-blue-700",
  3:"bg-purple-100 text-purple-700",
  4:"bg-orange-100 text-orange-700"
};

const AdminStudents = ()=>{

  const [students,setStudents] = useState<Student[]>([]);
  const [search,setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [departmentFilter,setDepartmentFilter] = useState("");
  const [yearFilter,setYearFilter] = useState("");
  const [sortField,setSortField] = useState<string | null>(null);
  const [sortOrder,setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal,setShowModal] = useState(false);
  const [editingStudent,setEditingStudent] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [deleteId,setDeleteId] = useState<number | null>(null);
  const [message,setMessage] = useState<string | null>(null);
  const [formError,setFormError] = useState<string | null>(null);
  const [currentPage,setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [form,setForm] = useState({
    name:"",
    usn:"",
    department:"",
    email:"",
    phone:"",
    year:1
  });
  const toggleSelect = (id:number)=>{
  setSelectedIds(prev =>
    prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
  );
};

const toggleSelectAll = ()=>{
  if(selectedIds.length === currentData.length){
    setSelectedIds([]);
  }else{
    setSelectedIds(currentData.map(s => s.id));
  }
};
  const fetchStudents = async ()=>{
    const res = await axios.get(API);
    setStudents(res.data);
  };
  useEffect(() => {
  fetchStudents()

  const stored = localStorage.getItem("student_search_history")
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
  localStorage.setItem("student_search_history", JSON.stringify(updated))
}
  const suggestions = students
  .filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.usn.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  )
  .slice(0, 5)
  useEffect(()=>{
    fetchStudents();
  },[]);
  const confirmBulkDelete = async ()=>{
  try{
    await Promise.all(
      selectedIds.map(id => axios.delete(`${API}${id}/`))
    );

    setSelectedIds([]);
    setBulkDeleteMode(false);
    fetchStudents();

    setMessage("Selected students deleted successfully");

  }catch{
    setMessage("Error deleting selected students");
  }
};
  const filteredStudents = students
.filter((s)=>{

  const searchValue = search.toLowerCase();

  const matchesSearch =
    s.name.toLowerCase().includes(searchValue) ||
    s.usn.toLowerCase().includes(searchValue) ||
    s.email.toLowerCase().includes(searchValue) ||
    s.phone.toLowerCase().includes(searchValue) ||
    s.department.toLowerCase().includes(searchValue) ||
    s.year.toString().includes(searchValue);

  const matchesDept =
    departmentFilter === "" || s.department === departmentFilter;

  const matchesYear =
    yearFilter === "" || s.year === Number(yearFilter);

  return matchesSearch && matchesDept && matchesYear;

})
.sort((a:any,b:any)=>{

  if(!sortField) return 0;

  if(a[sortField] < b[sortField]) return sortOrder==="asc"?-1:1;
  if(a[sortField] > b[sortField]) return sortOrder==="asc"?1:-1;

  return 0;
});

  const handleChange = (e:any)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = ()=>{
    setEditingStudent(null);
    setFormError(null);
    setForm({
      name:"",
      usn:"",
      department:"",
      email:"",
      phone:"",
      year:1
    });
    setShowModal(true);
  };

  const startEdit = (student:Student)=>{
    setEditingStudent(student);
    setFormError(null);
    setForm(student);
    setShowModal(true);
  };

  const saveStudent = async ()=>{

  /* -------- VALIDATION -------- */

  if(
    !form.name.trim() ||
    !form.usn.trim() ||
    !form.department ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.year
  ){
    setFormError("All fields are mandatory");
    return;
  }

  try{

    if(editingStudent){
      await axios.put(`${API}${editingStudent.id}/`,form);
      setMessage("Student updated successfully");
    }else{
      await axios.post(API,form);
      setMessage("Student added successfully");
    }

    setShowModal(false);
    fetchStudents();

  }catch(err:any){

    setFormError(
      err.response?.data?.error ||
      "Email or USN already exists"
    );

  }

};
const handleSort = (field:string)=>{
  setCurrentPage(1);
  if(sortField === field){
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

const sortIndicator = (field:string)=>{
  if(sortField !== field) return "";
  return sortOrder === "asc" ? "▲" : "▼";
};

  const confirmDelete = async ()=>{

  try{

    if(!deleteId) return;

    await axios.delete(`${API}${deleteId}/`);

    setDeleteId(null);
    fetchStudents();

    setMessage("Student deleted successfully");

  }catch{

    setMessage("Error deleting student");

  }

};
const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;
const currentData = filteredStudents.slice(indexOfFirst,indexOfLast);
const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  return (
  <AdminDashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">
      Students Management
    </h1>
{message && (
  <div className={`mb-4 px-4 py-2 rounded-lg text-sm flex justify-between items-center ${
    message.includes("deleted")
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700"
  }`}>
    {message}
    <button onClick={()=>setMessage(null)}>✕</button>
  </div>
)}

    {/* Search + Filters */}

<div className="flex flex-wrap items-center gap-4 mb-6">

  <div ref={searchRef} className="relative w-[250px]">

  <input
    placeholder="Search students..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value)
      setShowDropdown(true)
      setCurrentPage(1)
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
                localStorage.removeItem("student_search_history")
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
                  localStorage.setItem("student_search_history", JSON.stringify(updated))
                }}
                className="opacity-0 group-hover:opacity-100 cursor-pointer"
              />

            </div>
          ))}
        </div>
      )}

      {/* SUGGESTIONS */}
      {search && suggestions.map((s, i) => (
        <div
          key={i}
          onClick={() => {
            setSearch(s.name)
            saveSearch(s.name)
            setShowDropdown(false)
          }}
          className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 cursor-pointer"
        >
          <Search size={14} />
          {s.name} ({s.department})
        </div>
      ))}

    </div>
  )}

</div>

  <select
    value={departmentFilter}
    onChange={(e)=>{
  setDepartmentFilter(e.target.value);
  setCurrentPage(1);
}}
    className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
  >
    <option value="">All Departments</option>
    {departments.map((d)=>(
      <option key={d} value={d}>{d}</option>
    ))}
  </select>

  <select
    value={yearFilter}
    onChange={(e)=>{
  setYearFilter(e.target.value);
  setCurrentPage(1);
}}
    className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
  >
    <option value="">All Years</option>
    <option value="1">1st Year</option>
    <option value="2">2nd Year</option>
    <option value="3">3rd Year</option>
    <option value="4">4th Year</option>
  </select>
  <button
onClick={()=>{
  const headers = ["ID","USN","Name","Department","Year","Email","Phone"];

  const rows = filteredStudents.map(s=>[
    s.id,s.usn,s.name,s.department,s.year,s.email,s.phone
  ]);

  let csv =
    "data:text/csv;charset=utf-8," +
    [headers,...rows].map(r=>r.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "filtered_students.csv";
  link.click();
}}
className="px-4 py-2 rounded-lg text-sm font-medium 
border border-border bg-background 
hover:bg-primary/10 hover:text-primary hover:border-primary/40 
transition-all duration-200 shadow-sm hover:shadow"
>
Export Filtered
</button>

<button
onClick={()=>{
  const headers = ["ID","USN","Name","Department","Year","Email","Phone"];

  const rows = students.map(s=>[
    s.id,s.usn,s.name,s.department,s.year,s.email,s.phone
  ]);

  let csv =
    "data:text/csv;charset=utf-8," +
    [headers,...rows].map(r=>r.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "all_students.csv";
  link.click();
}}
className="px-4 py-2 rounded-lg text-sm font-medium 
bg-primary text-white hover:bg-primary/90 
transition-all duration-200 shadow hover:shadow-md"
>
Export All
</button>
  {!selectMode ? (
  <button
    onClick={() => {
      setSelectMode(true);
      setSelectedIds([]);
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    border border-border bg-background 
    hover:bg-primary/10 hover:text-primary hover:border-primary/40 
    transition shadow-sm"
  >
    Select
  </button>
) : (
  <button
    onClick={() => {
      setSelectMode(false);
      setSelectedIds([]);
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    border border-border bg-red-50 text-red-600 
    hover:bg-red-100 transition shadow-sm"
  >
    Cancel Selection
  </button>
)}
  {selectMode && selectedIds.length > 0 && (
  <button
    onClick={()=>setBulkDeleteMode(true)}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    bg-red-600 text-white hover:bg-red-700 
    transition shadow"
  >
    Delete Selected ({selectedIds.length})
  </button>
)}
  <button
    onClick={openAddModal}
    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition"
  >
    <Plus size={18}/>
    Add Student
  </button>

</div>

    {/* Table */}

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-secondary/50">

          <tr>
  {selectMode && (
  <th className="px-4 py-3 text-center">
    <input
      type="checkbox"
      checked={selectedIds.length === currentData.length && currentData.length > 0}
      onChange={toggleSelectAll}
    />
  </th>
)}
  <th onClick={()=>handleSort("id")} className="text-left px-4 py-3 cursor-pointer">
    ID {sortIndicator("id")}
  </th>

  <th onClick={()=>handleSort("usn")} className="text-left px-4 py-3 cursor-pointer">
    USN {sortIndicator("usn")}
  </th>

  <th onClick={()=>handleSort("name")} className="text-left px-4 py-3 cursor-pointer">
    Name {sortIndicator("name")}
  </th>

  <th onClick={()=>handleSort("department")} className="text-left px-4 py-3 cursor-pointer">
    Department {sortIndicator("department")}
  </th>

  <th onClick={()=>handleSort("year")} className="text-left px-4 py-3 cursor-pointer">
    Year {sortIndicator("year")}
  </th>

  <th className="text-left px-4 py-3">
    Email
  </th>

  <th className="text-left px-4 py-3">
    Phone
  </th>

  <th className="text-left px-4 py-3">
    Actions
  </th>

</tr>

        </thead>
{currentData.length === 0 && (
<tr>
  <td colSpan={selectMode ? 9 : 8} className="text-center py-4 text-muted-foreground">
    No students found
  </td>
</tr>
)}
        <tbody>

          {currentData.map((s)=>(
            <tr key={s.id} className="border-t border-border hover:bg-secondary/40 transition">
              {selectMode && (
  <td className="px-4 py-3 text-center">
    <input
      type="checkbox"
      checked={selectedIds.includes(s.id)}
      onChange={()=>toggleSelect(s.id)}
    />
  </td>
)}
              <td className="px-4 py-3 text-primary">{s.id}</td>

              <td className="px-4 py-3">{s.usn}</td>

              <td className="px-4 py-3 font-medium">
                {s.name}
              </td>

              <td className="px-4 py-3">

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${deptColors[s.department]}`}
                >
                  {s.department}
                </span>

              </td>

              <td className="px-4 py-3">

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${yearColors[s.year]}`}
                >
                  Year {s.year}
                </span>

              </td>

              <td className="px-4 py-3">{s.email}</td>

              <td className="px-4 py-3">{s.phone}</td>

              <td className="px-4 py-3 flex gap-2">

                <button
                  onClick={()=>startEdit(s)}
                  className="p-1.5 rounded text-blue-600 hover:bg-blue-100 hover:scale-110 transition"
                >
                  <Pencil size={16}/>
                </button>

                <button
                  onClick={()=>setDeleteId(s.id)}
                  className="p-1.5 rounded text-red-600 hover:bg-red-100 hover:scale-110 transition"
                >
                  <Trash2 size={16}/>
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
    <div className="flex justify-between items-center mt-5">

<p className="text-sm text-muted-foreground">
Page {currentPage} of {totalPages}
</p>

<div className="flex gap-2">

<button
  onClick={()=>setCurrentPage(p=>Math.max(p-1,1))}
  disabled={currentPage===1}
  className={`px-4 py-2 rounded-lg text-sm font-medium 
  flex items-center gap-1 border transition-all duration-200

  ${currentPage===1
    ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
    : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md"
  }`}
>
  ← Prev
</button>

<button
  onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))}
  disabled={currentPage===totalPages}
  className={`px-4 py-2 rounded-lg text-sm font-medium 
  flex items-center gap-1 border transition-all duration-200

  ${currentPage===totalPages
    ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
    : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md"
  }`}
>
  Next →
</button>

</div>
</div>


    {/* Add/Edit Modal */}

    {showModal && (

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-white p-6 rounded-xl w-[420px]">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-lg font-semibold">
              {editingStudent ? "Edit Student" : "Add Student"}
            </h2>

            <button onClick={()=>setShowModal(false)}>
              <X size={18}/>
            </button>

          </div>

          <div className="flex flex-col gap-3">
            {formError && (
  <div className="col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
    {formError}
  </div>
)}
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            />

            <input
              name="usn"
              placeholder="USN"
              value={form.usn}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            />

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            >
              <option value="">Select Department</option>
              {departments.map((d)=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            />

          </div>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={()=>setShowModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={saveStudent}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {editingStudent ? "Update Student" : "Add Student"}
            </button>

          </div>

        </div>

      </div>

    )}
    
    {/* Delete Confirmation */}

    {deleteId && (

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-white rounded-xl p-6 w-[340px] text-center shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Delete Student
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this student?
          </p>

          <div className="flex justify-center gap-4">

            <button
              onClick={()=>setDeleteId(null)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
      
    )}


{/* ✅ BULK DELETE MODAL */}

{bulkDeleteMode && (

  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

    <div className="bg-white rounded-xl p-6 w-[360px] text-center shadow-lg">

      <h2 className="text-lg font-semibold mb-2 text-red-600">
        Bulk Delete
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-red-600">
          {selectedIds.length}
        </span>{" "}
        students?
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

export default AdminStudents;