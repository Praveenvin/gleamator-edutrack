import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Faculty {
  id?: number;
  name: string;
  department: string;
  designation: string;
  email: string;
}

const deptColors: Record<string,string> = {
  AI: "bg-purple-100 text-purple-700",
  CSE: "bg-blue-100 text-blue-700",
  ISE: "bg-green-100 text-green-700",
  ECE: "bg-orange-100 text-orange-700",
  MECH: "bg-gray-200 text-gray-700"
};

const API = "http://127.0.0.1:8000/api/faculty/";

const departments = ["AI","CSE","ISE","ECE","MECH"];
const designations = ["Assistant Professor","Associate Professor","Professor"];

const AdminFaculty = () => {

  const [faculty,setFaculty] = useState<Faculty[]>([]);
  const [search,setSearch] = useState("");

  const [departmentFilter,setDepartmentFilter] = useState("All");
  const [designationFilter,setDesignationFilter] = useState("All");

  const [sortField,setSortField] = useState<string | null>(null);
  const [sortOrder,setSortOrder] = useState<"asc" | "desc">("asc");

  const [showModal,setShowModal] = useState(false);
  const [editing,setEditing] = useState(false);

  const [deleteId,setDeleteId] = useState<number | null>(null);

  const [message,setMessage] = useState<string | null>(null);
  const [formError,setFormError] = useState<string | null>(null);

  const [form,setForm] = useState<Faculty>({
    name:"",
    department:"",
    designation:"",
    email:""
  });

  /* ✅ PAGINATION */
  const [currentPage,setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const fetchFaculty = async ()=>{
    const res = await axios.get(API);
    setFaculty(res.data);
  };

  useEffect(()=>{
    fetchFaculty();
  },[]);

  const handleChange = (e:any)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAdd = ()=>{
    setEditing(false);
    setFormError(null);
    setForm({
      name:"",
      department:"",
      designation:"",
      email:""
    });
    setShowModal(true);
  };

  const openEdit = (f:Faculty)=>{
    setEditing(true);
    setFormError(null);
    setForm(f);
    setShowModal(true);
  };

  const saveFaculty = async ()=>{

    if(!form.name.trim() || !form.department || !form.designation || !form.email.trim()){
      setFormError("All fields are mandatory");
      return;
    }

    try{

      if(editing){
        await axios.put(`${API}${form.id}/`,form);
        setMessage("Faculty updated successfully");
      } else {
        await axios.post(API,form);
        setMessage("Faculty added successfully");
      }

      setShowModal(false);
      fetchFaculty();

    }catch(err:any){
      setFormError(
        err.response?.data?.error ||
        "Email already exists"
      );
    }
  };

  const confirmDelete = async ()=>{

    try{
      if(!deleteId) return;

      await axios.delete(`${API}${deleteId}/`);

      setDeleteId(null);
      fetchFaculty();
      setMessage("Faculty deleted successfully");

    }catch{
      setMessage("Error deleting faculty");
    }
  };

  const handleSort = (field:string)=>{
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

  /* ✅ FILTER */
  const filteredFaculty = faculty
  .filter((f)=>{

    const searchValue = search.toLowerCase();

    const matchSearch =
      f.name.toLowerCase().includes(searchValue) ||
      f.email.toLowerCase().includes(searchValue) ||
      f.department.toLowerCase().includes(searchValue) ||
      f.designation.toLowerCase().includes(searchValue) ||
      f.id?.toString().includes(searchValue);

    const matchDept =
      departmentFilter === "All" ||
      f.department === departmentFilter;

    const matchDesignation =
      designationFilter === "All" ||
      f.designation === designationFilter;

    return matchSearch && matchDept && matchDesignation;

  })
  .sort((a:any,b:any)=>{

    if(!sortField) return 0;

    const valA = a[sortField];
    const valB = b[sortField];

    if(valA < valB) return sortOrder === "asc" ? -1 : 1;
    if(valA > valB) return sortOrder === "asc" ? 1 : -1;

    return 0;

  });

  /* ✅ PAGINATION LOGIC */
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredFaculty.slice(indexOfFirst,indexOfLast);
  const totalPages = Math.ceil(filteredFaculty.length / rowsPerPage);

  return (
  <AdminDashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">
      Faculty Management
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

    <div className="flex flex-wrap items-center gap-4 mb-6">

      <input
        placeholder="Search faculty..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="border border-border px-4 py-2.5 rounded-lg text-sm 
        hover:border-primary/40 focus:outline-none focus:ring-2 
        focus:ring-primary/20 transition"
      />

      <select
        value={departmentFilter}
        onChange={(e)=>setDepartmentFilter(e.target.value)}
        className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
      >
        <option value="All">All Departments</option>
        {departments.map(d=>(<option key={d}>{d}</option>))}
      </select>

      <select
        value={designationFilter}
        onChange={(e)=>setDesignationFilter(e.target.value)}
        className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
      >
        <option value="All">All Designations</option>
        {designations.map(d=>(<option key={d}>{d}</option>))}
      </select>
      <button
onClick={()=>{
  const headers = ["ID","Name","Department","Designation","Email"];

  const rows = filteredFaculty.map(f=>[
    `FAC${f.id?.toString().padStart(3,"0")}`,
    f.name,
    f.department,
    f.designation,
    f.email
  ]);

  let csv =
    "data:text/csv;charset=utf-8," +
    [headers,...rows].map(r=>r.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "filtered_faculty.csv";
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
  const headers = ["ID","Name","Department","Designation","Email"];

  const rows = faculty.map(f=>[
    `FAC${f.id?.toString().padStart(3,"0")}`,
    f.name,
    f.department,
    f.designation,
    f.email
  ]);

  let csv =
    "data:text/csv;charset=utf-8," +
    [headers,...rows].map(r=>r.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "all_faculty.csv";
  link.click();
}}
className="px-4 py-2 rounded-lg text-sm font-medium 
bg-primary text-white hover:bg-primary/90 
transition-all duration-200 shadow hover:shadow-md"
>
Export All
</button>
      <button
        onClick={openAdd}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition"
      >
        <Plus size={18}/>
        Add Faculty
      </button>

    </div>

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-secondary/50">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th onClick={()=>handleSort("name")} className="px-4 py-3 cursor-pointer">
              Name {sortIndicator("name")}
            </th>
            <th onClick={()=>handleSort("department")} className="px-4 py-3 cursor-pointer">
              Department {sortIndicator("department")}
            </th>
            <th onClick={()=>handleSort("designation")} className="px-4 py-3 cursor-pointer">
              Designation {sortIndicator("designation")}
            </th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((f)=>(
            <tr key={f.id} className="border-t border-border hover:bg-secondary/40 transition">
              <td className="px-4 py-3 font-mono-data text-primary">
                FAC{f.id?.toString().padStart(3,"0")}
              </td>

              <td className="px-4 py-3 font-medium">{f.name}</td>

              <td className="px-4 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${deptColors[f.department] || "bg-gray-100 text-gray-600"}`}>
                  {f.department}
                </span>
              </td>

              <td className="px-4 py-3">{f.designation}</td>

              <td className="px-4 py-3">{f.email}</td>

              <td className="px-4 py-3 flex gap-2">
                <button onClick={()=>openEdit(f)} className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition">
                  <Pencil size={16}/>
                </button>
                <button onClick={()=>setDeleteId(f.id || null)} className="p-1.5 rounded text-red-600 hover:bg-red-100 transition">
                  <Trash2 size={16}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>

    {/* PAGINATION */}
    <div className="flex justify-between items-center mt-4">
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

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <div className="bg-white p-6 rounded-xl w-[420px]">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editing ? "Edit Faculty" : "Add Faculty"}
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

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/40"
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
              {departments.map(d=>(<option key={d}>{d}</option>))}
            </select>

            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            >
              <option value="">Select Designation</option>
              {designations.map(d=>(<option key={d}>{d}</option>))}
            </select>

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/40"
            />

          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button onClick={saveFaculty} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
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