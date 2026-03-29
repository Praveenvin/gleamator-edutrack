import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Pencil, Trash2, Plus, X, Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface Course {
  id?: number;
  course_name: string;
  course_code: string;
  semester: number;
  department: string;
  faculty: number;
}

interface Student {
  id: number;
  course_id: number;
  name?: string;
  department?: string;
  year?: number;
}

const API = "http://127.0.0.1:8000/api";

const departments = ["AI","CSE","ISE","ECE","MECH"];

const FacultyCourses = () => {

  const facultyId = Number(localStorage.getItem("faculty_id"));

  const [courses,setCourses] = useState<Course[]>([]);
  const [students,setStudents] = useState<Student[]>([]);
  const [enrollments,setEnrollments] = useState<any[]>([]);
  const [showModal,setShowModal] = useState(false);
  const [editing,setEditing] = useState(false);
  const [deleteId,setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [message,setMessage] = useState<string | null>(null);
  const [formError,setFormError] = useState<string | null>(null);

  // 🔥 NEW STATES (ADDED ONLY)
  const [manageModal,setManageModal] = useState(false);
  const [selectedCourse,setSelectedCourse] = useState<number | null>(null);
  const [selectedStudents,setSelectedStudents] = useState<number[]>([]);
  const [existingEnrollments,setExistingEnrollments] = useState<any[]>([]);
  const [modalError,setModalError] = useState<string | null>(null);

  const [search,setSearch] = useState("");
  const [deptFilter,setDeptFilter] = useState("");
  const [yearFilter,setYearFilter] = useState("");

  const [form,setForm] = useState<Course>({
    course_name:"",
    course_code:"",
    semester:1,
    department:"",
    faculty:facultyId
  });

  // ================= FETCH =================
  const fetchData = async ()=>{
    try{
      const [cRes,sRes] = await Promise.all([
  axios.get(`${API}/courses/`),
  axios.get(`${API}/students/`)
]);

setCourses(cRes.data.filter((c:any)=>c.faculty==facultyId));
setStudents(sRes.data);

// ✅ SAFE enrollments fetch
try{
  const eRes = await axios.get(`${API}/enrollments/`);
  setEnrollments(eRes.data);
}catch(err){
  console.warn("Enrollment fetch failed", err);
}

      setCourses(cRes.data.filter((c:any)=>c.faculty==facultyId));
      setStudents(sRes.data);

    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{ fetchData(); },[]);

  const getCount = (id:number)=>
  enrollments.filter((e:any)=>e.course === id).length;

  // ================= NEW FUNCTIONS =================

  const openManageStudents = async (courseId:number)=>{
    setSelectedCourse(courseId);
    setManageModal(true);
    setModalError(null);

    try{
      const res = await axios.get(`${API}/enrollments/?course=${courseId}`);
      console.log("Enrollments:", res.data);
      setExistingEnrollments(res.data);

      const ids = res.data.map((e:any)=>e.student);
      setSelectedStudents(ids);

    }catch(err){
      console.error(err);
    }
  };

  const toggleStudent = (id:number)=>{
    setSelectedStudents(prev =>
      prev.includes(id)
        ? prev.filter(s=>s!==id)
        : [...prev,id]
    );
  };

  const handleSelectAll = ()=>{
    const ids = filteredStudents.map((s:any)=>s.id);

    const allSelected = ids.every(id => selectedStudents.includes(id));

    if(allSelected){
      setSelectedStudents(prev =>
        prev.filter(id => !ids.includes(id))
      );
    }else{
      setSelectedStudents(prev =>
        Array.from(new Set([...prev,...ids]))
      );
    }
  };

  const saveStudents = async ()=>{
    if(!selectedCourse) return;

    try{

      const toAdd = selectedStudents.filter(
  id => !existingEnrollments.some(
    (e:any)=> (e.student || e.student_id) === id
  )
);

      const toRemove = existingEnrollments.filter(
  (e:any)=>{
    const studentId = e.student || e.student_id;
    return !selectedStudents.includes(studentId);
  }
);

      // ADD safely (avoid breaking on one error)
      for(const id of toAdd){
        try{
          await axios.post(`${API}/enrollments/`,{
            student:id,
            course:selectedCourse
          });
        }catch(err:any){
          if(err.response?.data?.error){
            setModalError(err.response.data.error);
            return;
          }
        }
      }

      // REMOVE
      await Promise.all(
  toRemove.map(async (e:any) => {
    console.log("Deleting:", e);

    if (!e.id) {
      console.warn("No ID found for enrollment", e);
      return;
    }

    await axios.delete(`${API}/enrollments/${e.id}/`);
  })
);

      setManageModal(false);
      setMessage("Students updated successfully");
      fetchData();
    }catch{
      setModalError("Something went wrong");
    }
  };

  const filteredStudents = students.filter((s:any)=>{
    return (
      (s.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (!deptFilter || s.department===deptFilter) &&
      (!yearFilter || s.year===Number(yearFilter))
    );
  });

  // ================= OPEN =================
  const openAdd = ()=>{
    setEditing(false);
    setFormError(null);
    setForm({
      course_name:"",
      course_code:"",
      semester:1,
      department:"",
      faculty:facultyId
    });
    setShowModal(true);
  };

  const openEdit = (c:Course)=>{
    setEditing(true);
    setFormError(null);
    setForm(c);
    setShowModal(true);
  };

  // ================= SAVE =================
  const saveCourse = async ()=>{

    if(!form.course_name || !form.course_code || !form.department || !form.semester){
      setFormError("All fields are mandatory");
      return;
    }

    try{

      if(editing){
        await axios.put(`${API}/courses/${form.id}/`,form);
        setMessage("Course updated successfully");
      } else {
        await axios.post(`${API}/courses/`,form);
        setMessage("Course added successfully");
      }

      setShowModal(false);
      fetchData();

    }catch{
      setFormError("Error saving course");
    }

  };

  // ================= DELETE =================
  const confirmDelete = async ()=>{
    try{
      if(!deleteId) return;

      await axios.delete(`${API}/courses/${deleteId}/`);
      setDeleteId(null);
      fetchData();
      setMessage("Course deleted successfully");

    }catch{
      setMessage("Error deleting course");
    }
  };

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        My Courses
      </h1>

      {/* MESSAGE */}
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

      {/* ADD BUTTON */}
      <button
        onClick={openAdd}
        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg shadow hover:shadow-md transition mb-6"
      >
        <Plus size={18}/> Add Course
      </button>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">

        {courses.map(c=>(
          <div key={c.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex justify-between items-center mb-3">

              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {c.course_code}
              </span>

              <div className="flex gap-2">
                <button onClick={()=>openEdit(c)} className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition">
                  <Pencil size={16}/>
                </button>
                <button onClick={()=>setDeleteId(c.id || null)} className="p-1.5 rounded text-red-600 hover:bg-red-100 transition">
                  <Trash2 size={16}/>
                </button>
              </div>

            </div>

            <h3 className="text-lg font-semibold text-foreground">
              {c.course_name}
            </h3>

            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Users size={14}/>
                {getCount(c.id!)} students
              </p>
              <p>Department: {c.department}</p>
              <p>Semester {c.semester}</p>
            </div>

            {/* 🔥 NEW BUTTON */}
            <button
              onClick={()=>openManageStudents(c.id!)}
              className="mt-4 w-full bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition"
            >
              Manage Students
            </button>

          </div>
        ))}

      </div>

      {/* TABLE */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Dept</th>
              <th className="px-4 py-3 text-left">Sem</th>
              <th className="px-4 py-3 text-left">Students</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map(c=>(
              <tr key={c.id} className="border-t border-border hover:bg-secondary/40 transition">

                <td className="px-4 py-3 font-mono text-primary text-xs">
                  {c.course_code}
                </td>

                <td className="px-4 py-3 font-medium">
  <span
    onClick={() => navigate(`/faculty-dashboard/course/${c.id}`)}
    className="cursor-pointer text-foreground hover:opacity-70"
  >
    {c.course_name}
  </span>
</td>

                <td className="px-4 py-3 text-muted-foreground">
                  {c.department}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {c.semester}
                </td>

                <td className="px-4 py-3">
                  {getCount(c.id!)}
                </td>

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

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[380px] shadow-lg">

            <h2 className="text-lg font-semibold mb-3">
              Delete Course
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete this course?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setDeleteId(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100"
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

      {/* COURSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">

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
                name="course_name"
                placeholder="Course Name"
                value={form.course_name}
                onChange={(e)=>setForm({...form,course_name:e.target.value})}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />

              <input
                name="course_code"
                placeholder="Course Code"
                value={form.course_code}
                onChange={(e)=>setForm({...form,course_code:e.target.value})}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />

              <select
                name="department"
                value={form.department}
                onChange={(e)=>setForm({...form,department:e.target.value})}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              >
                <option value="">Select Department</option>
                {departments.map(d=>(<option key={d}>{d}</option>))}
              </select>

              <select
                name="semester"
                value={form.semester}
                onChange={(e)=>setForm({...form,semester:Number(e.target.value)})}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              >
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(s=>(<option key={s} value={s}>{s}</option>))}
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={()=>setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100"
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

      {/* 🔥 MANAGE STUDENTS MODAL */}
      {manageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[600px] shadow-lg">

            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Manage Students</h2>
              <button onClick={()=>setManageModal(false)}>
                <X size={18}/>
              </button>
            </div>

            {/* ERROR INSIDE MODAL */}
            {modalError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {modalError}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-4">

              <input
                placeholder="Search"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:ring-2 focus:ring-primary/20"
              />

              <select
                value={deptFilter}
                onChange={(e)=>setDeptFilter(e.target.value)}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Department</option>
                {departments.map(d=>(<option key={d}>{d}</option>))}
              </select>

              <select
                value={yearFilter}
                onChange={(e)=>setYearFilter(e.target.value)}
                className="border border-border px-3 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Year</option>
                {[1,2,3,4].map(y=>(<option key={y}>{y}</option>))}
              </select>

            </div>

            {/* SELECT ALL */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Students List</p>
              <button onClick={handleSelectAll} className="text-sm text-primary hover:underline">
                Select All
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredStudents.map((s:any)=>(
                <label key={s.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-secondary/40 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={()=>toggleStudent(s.id)}
                  />

                  <span>{s.name} ({s.department}, Year {s.year})</span>

                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={()=>setManageModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={saveStudents}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

    </FacultyDashboardLayout>
  );
};

export default FacultyCourses;