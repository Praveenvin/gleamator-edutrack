import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Course {
  id?: number
  course_name: string
  course_code: string
  department: string
  faculty: number | ""
  faculty_name?: string
  semester: number | ""
}

const API = "http://127.0.0.1:8000/api/courses/"
const FACULTY_API = "http://127.0.0.1:8000/api/faculty/"

const departments = ["AI","CSE","ISE","ECE","MECH"]

const deptColors: Record<string,string> = {
  AI:"bg-purple-100 text-purple-700",
  CSE:"bg-blue-100 text-blue-700",
  ISE:"bg-green-100 text-green-700",
  ECE:"bg-orange-100 text-orange-700",
  MECH:"bg-gray-200 text-gray-700"
}

const AdminCourses = ()=>{

  const [courses,setCourses] = useState<Course[]>([])
  const [facultyList,setFacultyList] = useState<any[]>([])

  const [search,setSearch] = useState("")
  const [departmentFilter,setDepartmentFilter] = useState("All")

  const [sortField,setSortField] = useState<string | null>(null)
  const [sortOrder,setSortOrder] = useState<"asc" | "desc">("asc")

  const [currentPage,setCurrentPage] = useState(1)
  const rowsPerPage = 8

  const [showModal,setShowModal] = useState(false)
  const [editing,setEditing] = useState(false)

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false)
  const [selectMode, setSelectMode] = useState(false)

  const [deleteId,setDeleteId] = useState<number | null>(null)

  const [message,setMessage] = useState<string | null>(null)
  const [formError,setFormError] = useState<string | null>(null)

  const [form,setForm] = useState<Course>({
    course_name:"",
    course_code:"",
    department:"",
    faculty:"",
    semester:""
  })

  const fetchCourses = async ()=>{
    const res = await axios.get(API)
    setCourses(res.data)
  }

  const fetchFaculty = async ()=>{
    const res = await axios.get(FACULTY_API)
    setFacultyList(res.data)
  }

  useEffect(()=>{
    fetchCourses()
    fetchFaculty()
  },[])
  useEffect(()=>{
  setCurrentPage(1)
},[search, departmentFilter])

  const handleChange = (e:any)=>{
    let value = e.target.value
    if(e.target.name === "course_code"){
      value = value.toUpperCase()
    }
    setForm({...form,[e.target.name]: value})
  }

  const openAdd = ()=>{
    setEditing(false)
    setFormError(null)
    setForm({
      course_name:"",
      course_code:"",
      department:"",
      faculty:"",
      semester:""
    })
    setShowModal(true)
  }

  const openEdit = (c:Course)=>{
    setEditing(true)
    setFormError(null)
    setForm(c)
    setShowModal(true)
  }
  const toggleSelect = (id:number)=>{
  setSelectedIds(prev =>
    prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
  )
}

const toggleSelectAll = ()=>{
  if(selectedIds.length === currentData.length){
    setSelectedIds([])
  } else {
    setSelectedIds(currentData.map(c => c.id as number))
  }
}

const confirmBulkDelete = async ()=>{
  try{
    await Promise.all(
      selectedIds.map(id => axios.delete(`${API}${id}/`))
    )

    setSelectedIds([])
    setBulkDeleteMode(false)
    fetchCourses()

    setMessage("Selected courses deleted successfully")

  }catch{
    setMessage("Error deleting selected courses")
  }
}
  const saveCourse = async ()=>{
    if(!form.course_name || !form.course_code || !form.department || !form.faculty || !form.semester){
      setFormError("All fields are mandatory")
      return
    }
    try{
      if(editing){
        await axios.put(`${API}${form.id}/`,form)
        setMessage("Course updated successfully")
      } else {
        await axios.post(API,form)
        setMessage("Course added successfully")
      }
      setShowModal(false)
      fetchCourses()
    }catch(err:any){
      setFormError(err.response?.data?.error || "Course code already exists")
    }
  }

  const confirmDelete = async ()=>{
    if(!deleteId) return
    await axios.delete(`${API}${deleteId}/`)
    setDeleteId(null)
    fetchCourses()
    setMessage("Course deleted successfully")
  }

  /* FILTER + SEARCH + SORT */
  const filteredCourses = courses
  .filter((c)=>{
    const s = search.toLowerCase()
    const matchSearch =
      c.course_name.toLowerCase().includes(s) ||
      c.course_code.toLowerCase().includes(s) ||
      c.faculty_name?.toLowerCase().includes(s) ||
      c.department.toLowerCase().includes(s)

    const matchDept =
      departmentFilter === "All" || c.department === departmentFilter

    return matchSearch && matchDept
  })
  .sort((a:any,b:any)=>{
  if(!sortField) return 0

  const A = (a[sortField] || "").toString().toLowerCase()
  const B = (b[sortField] || "").toString().toLowerCase()

  if(A < B) return sortOrder === "asc" ? -1 : 1
  if(A > B) return sortOrder === "asc" ? 1 : -1
  return 0
})

  /* PAGINATION */
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage
  const currentData = filteredCourses.slice(indexOfFirst,indexOfLast)
  const totalPages = Math.ceil(filteredCourses.length / rowsPerPage)

  const handleSort = (field:string)=>{
    if(sortField === field){
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortIndicator = (field:string)=>{
    if(sortField !== field) return ""
    return sortOrder === "asc" ? "▲" : "▼"
  }

  return (
  <AdminDashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">
      Courses Management
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
        placeholder="Search courses..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="border border-border px-4 py-2.5 rounded-lg text-sm 
        hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
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

      {/* EXPORT BUTTONS */}
      <button
        onClick={()=>{
          const headers = ["Code","Name","Department","Faculty","Semester"]
          const rows = filteredCourses.map(c=>[
            c.course_code,
            c.course_name,
            c.department,
            c.faculty_name,
            c.semester
          ])
          let csv = "data:text/csv;charset=utf-8," + [headers,...rows].map(r=>r.join(",")).join("\n")
          const link = document.createElement("a")
          link.href = encodeURI(csv)
          link.download = "filtered_courses.csv"
          link.click()
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background 
        hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow"
      >
        Export Filtered
      </button>

      <button
        onClick={()=>{
          const headers = ["Code","Name","Department","Faculty","Semester"]
          const rows = courses.map(c=>[
            c.course_code,
            c.course_name,
            c.department,
            c.faculty_name,
            c.semester
          ])
          let csv = "data:text/csv;charset=utf-8," + [headers,...rows].map(r=>r.join(",")).join("\n")
          const link = document.createElement("a")
          link.href = encodeURI(csv)
          link.download = "all_courses.csv"
          link.click()
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all duration-200 shadow hover:shadow-md"
      >
        Export All
      </button>
        {!selectMode ? (
  <button
    onClick={()=>{
      setSelectMode(true)
      setSelectedIds([])
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
      setSelectMode(false)
      setSelectedIds([])
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
        Add Course
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
        checked={selectedIds.length === currentData.length && currentData.length > 0}
        onChange={toggleSelectAll}
      />
    </th>
  )}

            <th className="px-4 py-3">Code</th>
            <th onClick={()=>handleSort("course_name")} className="px-4 py-3 cursor-pointer">
              Course Name {sortIndicator("course_name")}
            </th>
            <th onClick={()=>handleSort("department")} className="px-4 py-3 cursor-pointer">
              Department {sortIndicator("department")}
            </th>
            <th
  onClick={()=>handleSort("faculty_name")}
  className="px-4 py-3 cursor-pointer"
>
  Faculty {sortIndicator("faculty_name")}
</th>
            <th onClick={()=>handleSort("semester")} className="px-4 py-3 cursor-pointer">
              Semester {sortIndicator("semester")}
            </th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 && (
  <tr>
    <td colSpan={selectMode ? 7 : 6} className="text-center py-4 text-muted-foreground">
      No courses found
    </td>
  </tr>
)}
          {currentData.map(c=>(
            <tr key={c.id} className={`border-t border-border hover:bg-secondary/40 transition ${
  selectedIds.includes(c.id || 0) ? "bg-blue-50" : ""
}`}>
              {selectMode && (
  <td className="px-4 py-3 text-center">
    <input
      type="checkbox"
      checked={selectedIds.includes(c.id || 0)}
      onChange={()=>toggleSelect(c.id as number)}
    />
  </td>
)}
              <td className="px-4 py-3 font-mono-data text-primary">{c.course_code}</td>
              <td className="px-4 py-3 font-medium">{c.course_name}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${deptColors[c.department]}`}>
                  {c.department}
                </span>
              </td>
              <td className="px-4 py-3">{c.faculty_name}</td>
              <td className="px-4 py-3">Sem {c.semester}</td>

              <td className="px-4 py-3 flex gap-2">
                <button onClick={()=>openEdit(c)} className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition">
                  <Pencil size={16}/>
                </button>
                <button onClick={()=>setDeleteId(c.id || null)} className="p-1.5 rounded text-red-600 hover:bg-red-100 transition">
                  <Trash2 size={16}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

    {/* PAGINATION */}
    <div className="flex justify-between items-center mt-6">

  {/* INFO */}
  <p className="text-sm text-muted-foreground">
    Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
  </p>

  {/* CONTROLS */}
  <div className="flex gap-2">

    {/* PREV */}
    <button
      disabled={currentPage === 1}
      onClick={()=>setCurrentPage(p=>Math.max(p-1,1))}
      className="px-4 py-2 text-sm border border-border rounded-lg 
      disabled:opacity-40 disabled:cursor-not-allowed
      hover:bg-primary hover:text-white transition"
    >
      ← Prev
    </button>

    {/* NEXT */}
    <button
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))}
      className="px-4 py-2 text-sm border border-border rounded-lg 
      disabled:opacity-40 disabled:cursor-not-allowed
      hover:bg-primary hover:text-white transition"
    >
      Next →
    </button>

  </div>

</div>
    {/* Add / Edit Modal */}

    {showModal && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <div className="bg-white p-6 rounded-2xl w-[440px] shadow-xl border border-border">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-lg font-semibold text-foreground">
      {editing ? "Edit Course" : "Add Course"}
    </h2>
    <button className="p-1 rounded hover:bg-secondary transition" onClick={()=>setShowModal(false)}>
      <X size={18}/>
    </button>
  </div>

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-lg font-semibold">
              {editing ? "Edit Course" : "Add Course"}
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
              name="course_code"
              placeholder="Course Code (ex: CS301)"
              value={form.course_code}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />

            <input
              name="course_name"
              placeholder="Course Name"
              value={form.course_name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select Department</option>
              {departments.map(d=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select Faculty</option>

              {facultyList.map((f:any)=>(
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}

            </select>

            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select Semester</option>
              <option value="1">Sem 1</option>
              <option value="2">Sem 2</option>
              <option value="3">Sem 3</option>
              <option value="4">Sem 4</option>
              <option value="5">Sem 5</option>
              <option value="6">Sem 6</option>
              <option value="7">Sem 7</option>
              <option value="8">Sem 8</option>
            </select>

          </div>

          <div className="flex justify-end gap-3 mt-4">

            <button
              onClick={()=>setShowModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={saveCourse}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Save
            </button>

          </div>

        </div>

      </div>

    )}

    {/* Delete Modal */}

    {deleteId && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <div className="bg-white p-6 rounded-xl w-[320px] text-center">

          <h2 className="text-lg font-semibold mb-3">
            Delete Course
          </h2>

          <p className="text-sm text-muted-foreground mb-5">
            Are you sure you want to delete this course?
          </p>

          <div className="flex justify-center gap-3">

            <button
              onClick={()=>setDeleteId(null)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    )}
        {bulkDeleteMode && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

    <div className="bg-white rounded-xl p-6 w-[360px] text-center shadow-lg">

      <h2 className="text-lg font-semibold mb-2 text-red-600">
        Bulk Delete
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Delete {selectedIds.length} courses?
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
  )
}

export default AdminCourses


