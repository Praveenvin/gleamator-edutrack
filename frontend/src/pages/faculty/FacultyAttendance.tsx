// FULL FINAL VERSION (CLEAN + PROFESSIONAL)

import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,Cell, 
} from "recharts";

const API = "http://127.0.0.1:8000/api";
const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4"];
const FacultyAttendance = () => {

  const facultyId = Number(localStorage.getItem("faculty_id"));
  const today = new Date().toISOString().split("T")[0];

  const [courses,setCourses] = useState<any[]>([]);
  const [students,setStudents] = useState<any[]>([]);
  const [enrollments,setEnrollments] = useState<any[]>([]);
  const [records,setRecords] = useState<any[]>([]);

  const [selectedDate,setSelectedDate] = useState(today);
  const [selectedCourse,setSelectedCourse] = useState<number|null>(null);

  const [mode,setMode] = useState<"dashboard"|"mark">("dashboard");
  const [attendance,setAttendance] = useState<any>({});
  const [isEditing,setIsEditing] = useState(false);

  const [message,setMessage] = useState<string|null>(null);
  const [error,setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  // ================= FETCH =================
  useEffect(()=>{
    const fetchAll = async ()=>{
      const [c,s,e,a] = await Promise.all([
        axios.get(`${API}/courses/`),
        axios.get(`${API}/students/`),
        axios.get(`${API}/enrollments/`),
        axios.get(`${API}/attendance/`)
      ]);

      setCourses(c.data.filter((x:any)=>x.faculty==facultyId));
      setStudents(s.data);
      setEnrollments(e.data);
      setRecords(a.data);
    };
    fetchAll();
  },[]);

  // ================= HELPERS =================
  const getStudents = (courseId:number)=>{
    const ids = enrollments.filter((e:any)=>e.course===courseId).map((e:any)=>e.student);
    return students.filter((s:any)=>ids.includes(s.id));
  };

  const getRecord = (courseId:number)=>{
  return records.filter((r:any)=>
    Number(r.course) === Number(courseId) &&
    r.date === selectedDate
  );
};
  // ================= TOTAL STUDENTS =================
  const totalStudents = Array.from(new Set(enrollments.map((e:any)=>e.student))).length;

  // ================= OVERALL % =================
  const overallPercent = ()=>{
    const studentIds = Array.from(new Set(enrollments.map((e:any)=>e.student)));

    const values = studentIds.map((id:number)=>{
      const rec = records.filter((r:any)=>r.student===id);
      if(!rec.length) return 100;

      const p = rec.filter((x:any)=>x.status==="Present").length;
      return (p/rec.length)*100;
    });

    return Math.round(values.reduce((a,b)=>a+b,0)/values.length || 0);
  };

  // ================= LOW ATTENDANCE =================
  const lowAttendance:any = {};

  enrollments.forEach((e:any)=>{
    const rec = records.filter((r:any)=>r.student===e.student && r.course===e.course);
    if(!rec.length) return;

    const p = rec.filter((x:any)=>x.status==="Present").length;
    const percent = (p/rec.length)*100;

    if(percent < 75){
      const student = students.find(s=>s.id===e.student);
      const course = courses.find(c=>c.id===e.course);

      if(!lowAttendance[course.course_name]){
        lowAttendance[course.course_name] = new Map();
      }

      lowAttendance[course.course_name].set(student.id,{
        ...student,
        percent: Math.round(percent)
      });
    }
  });

  // ================= ABSENTEES =================
  const absentees:any = {};

  courses.forEach((c:any)=>{
  const rec = records.filter((r:any)=>
    Number(r.course) === Number(c.id) &&
    r.date === selectedDate &&
    r.status === "Absent"
  );

  rec.forEach((r:any)=>{
    if(!absentees[c.course_name]) absentees[c.course_name]=[];

    const s = students.find(x=>x.id===r.student);
    if(s) absentees[c.course_name].push(s);
  });
});

const chartData = courses.map((c:any)=>{
  const rec = records.filter((r:any)=>r.course===c.id);

  if(!rec.length){
    return {
      course: c.course_name,
      percent: 0
    };
  }

  const present = rec.filter((r:any)=>r.status==="Present").length;
  const percent = Math.round((present / rec.length) * 100);

  return {
    course: c.course_name,
    percent
  };
});

  // ================= START MARK =================
  const startMark = (courseId:number)=>{
    const rec = getRecord(courseId);

    setIsEditing(rec.length>0);

    const studs = getStudents(courseId);
    const map:any = {};

    studs.forEach((s:any)=>map[s.id]="Present");
    rec.forEach((r:any)=>{
  const status =
    r.status === "Present" || r.status === "present" || r.status === "P"
      ? "Present"
      : "Absent";

  map[r.student] = status;
});

    setSelectedCourse(courseId);
    setAttendance(map);
    setMode("mark");
  };

  const toggle = (id:number)=>{
  setAttendance((prev:any)=>({
    ...prev,
    [id]: prev[id] === "Absent" ? "Present" : "Absent"
  }));
};

  const submit = async () => {
  try {
    setLoading(true);
    setMessage(null);
    setError(null);

    let count = 0;

    for (const id of Object.keys(attendance)) {
      const studentId = Number(id);

      await axios.post(`${API}/attendance/`, {
        student: studentId,
        course: selectedCourse,
        date: selectedDate,
        status: attendance[id]
      });

      count++;
    }

    // refresh data
    const updated = await axios.get(`${API}/attendance/`);
    setRecords(updated.data);

    // ✅ success message
    setMessage(`Attendance saved successfully (${count} students) ✅`);

    // auto hide
    setTimeout(() => setMessage(null), 3000);

    setMode("dashboard");

  } catch (err) {
    console.error(err);

    setError("Failed to save attendance ❌");
    setTimeout(() => setError(null), 3000);
  }
};
  // ================= UI =================
  return (
    <FacultyDashboardLayout>
{message && (
  <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-green-100 border border-green-200 text-green-700 text-sm flex justify-between items-center shadow-sm">
    {message}
    <button
      onClick={() => setMessage(null)}
      className="text-green-700 hover:text-green-900"
    >
      ✕
    </button>
  </div>
)}

{error && (
  <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm flex justify-between items-center shadow-sm">
    {error}
    <button
      onClick={() => setError(null)}
      className="text-red-700 hover:text-red-900"
    >
      ✕
    </button>
  </div>
)}
  {mode === "dashboard" && (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Attendance Dashboard</h1>

        <input
          type="date"
          max={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-4 py-2 rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

  {/* TOTAL STUDENTS */}
<div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition">

  <p className="text-xs text-blue-500 font-medium mb-1">
    Total Students
  </p>

  <h2 className="text-4xl font-bold text-blue-600">
    {totalStudents}
  </h2>

  <p className="text-xs text-muted-foreground mt-2">
    Enrolled in your courses
  </p>

</div>


{/* OVERALL ATTENDANCE */}
<div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition">

  <p className="text-xs text-green-600 font-medium mb-1">
    Overall Attendance
  </p>

  <h2 className="text-4xl font-bold text-green-600">
    {overallPercent()}%
  </h2>

  <p className="text-xs text-muted-foreground mt-2">
    Average across subjects
  </p>

</div>

  {/* LOW ATTENDANCE */}
  <div className="bg-card border rounded-2xl shadow-sm hover:shadow-lg transition duration-300 flex flex-col h-[260px] overflow-hidden">

    <div className="px-5 py-4 border-b flex justify-between items-center bg-red-50">
      <h2 className="text-sm font-semibold">Low Attendance</h2>
      <span className="text-xs text-muted-foreground">Below 75%</span>
    </div>

    <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">

      {Object.keys(lowAttendance).length === 0 ? (
        <p className="text-xs text-center text-muted-foreground mt-6">
          All good 🎉
        </p>
      ) : (
        Object.keys(lowAttendance).map(sub => (
          <div key={sub}>
            <p className="text-xs font-semibold text-primary mb-2">{sub}</p>

            {[...lowAttendance[sub].values()].map((s:any)=>(
              <div
                key={s.id}
                className="flex justify-between items-center text-xs bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
              >
                <span className="truncate">{s.name}</span>
                <span className="text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded-full">
                  {s.percent}%
                </span>
              </div>
            ))}
          </div>
        ))
      )}

    </div>
  </div>

  {/* ABSENTEES */}
  <div className="bg-card border rounded-2xl shadow-sm hover:shadow-lg transition duration-300 flex flex-col h-[260px] overflow-hidden">

    <div className="px-5 py-4 border-b flex justify-between items-center bg-red-50">
      <h2 className="text-sm font-semibold">Today's Absentees</h2>
      <span className="text-xs text-muted-foreground">{selectedDate}</span>
    </div>

    <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">

      {Object.keys(absentees).length === 0 ? (
        <p className="text-xs text-center text-muted-foreground mt-6">
          No absentees 🎉
        </p>
      ) : (
        Object.keys(absentees).map(sub => (
          <div key={sub}>
            <p className="text-xs font-semibold text-primary mb-2">{sub}</p>

            {absentees[sub].map((s:any)=>(
              <div
                key={s.id}
                className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
              >
                {s.name}
              </div>
            ))}
          </div>
        ))
      )}
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr>
              <th className="px-6 py-4 text-left">Course</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c: any) => {
              const rec = getRecord(c.id);

              return (
                <tr key={c.id} className="border-t hover:bg-secondary/30 transition">

                  <td className="px-6 py-4">{c.course_name}</td>

                  <td className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      rec.length > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {rec.length > 0 ? "Taken" : "Pending"}
                    </span>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => startMark(c.id)}
                      className={`px-4 py-2 rounded-lg text-white text-xs ${
                        rec.length > 0
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-primary hover:opacity-90"
                      }`}
                    >
                      {rec.length > 0 ? "Edit" : "Take Attendance"}
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

      </div>

    </div>
  )}

  {/* MARK MODE */}
  {mode === "mark" && (
    <div className="bg-card p-6 rounded-2xl border shadow-sm">

      <button
        onClick={() => setMode("dashboard")}
        className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">

        {getStudents(selectedCourse!).map((s: any) => (
          <div
            key={s.id}
            className="flex justify-between items-center px-4 py-3 border rounded-lg hover:bg-secondary/30 transition"
          >
            <span className="text-sm">
              {s.name} ({s.usn})
            </span>

            <button
              onClick={() => toggle(s.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                attendance[s.id] === "Present"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {attendance[s.id]}
            </button>
          </div>
        ))}

      </div>

      <div className="flex justify-end mt-5">
        <button
  onClick={submit}
  className={`px-6 py-2 rounded-lg text-white text-sm transition ${
    isEditing
      ? "bg-yellow-500 hover:bg-yellow-600"
      : "bg-primary hover:opacity-90"
  }`}
>
  {isEditing ? "Save Changes" : "Submit Attendance"}
</button>
      </div>

    </div>
  )}

</FacultyDashboardLayout>
  );
};

export default FacultyAttendance;