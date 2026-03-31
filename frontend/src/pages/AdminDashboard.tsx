import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = [
  "hsl(217,91%,60%)",
  "hsl(142,72%,29%)",
  "hsl(25,95%,53%)",
  "hsl(0,72%,51%)",
  "hsl(262,52%,47%)",
  "hsl(190,90%,40%)"
];

const AdminDashboard = () => {

  const [students,setStudents] = useState<any[]>([]);
  const [faculty,setFaculty] = useState<any[]>([]);
  const [courses,setCourses] = useState<any[]>([]);
  const [attendance,setAttendance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"students" | "faculty" | "courses">("students")
  const [deptData,setDeptData] = useState<any[]>([]);
  const [page, setPage] = useState(1)
  const pageSize = 5
  const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const total = deptData.reduce((sum, d) => sum + d.students, 0)
    const percent = ((data.value / total) * 100).toFixed(1)

    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-md text-xs">
        <p className="font-medium">{data.name}</p>
        <p>{data.value} students</p>
        <p className="text-muted-foreground">{percent}%</p>
      </div>
    )
  }
  return null
}
       // ✅ SAFE SORT FUNCTION
const safeSort = (arr:any[]) => {
  return [...arr].sort((a,b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })
}
useEffect(() => {
  setPage(1)
}, [activeTab])
  const [attendanceAnalytics,setAttendanceAnalytics] = useState<any[]>([]);
  const getDeptColor = (dept:string) => {
  const map:any = {
    CSE: "bg-blue-100 text-blue-700",
    ISE: "bg-purple-100 text-purple-700",
    ECE: "bg-green-100 text-green-700",
    MECH: "bg-orange-100 text-orange-700",
    AI: "bg-pink-100 text-pink-700",
  }

  return map[dept] || "bg-gray-100 text-gray-700"
}
  const [recentStudents,setRecentStudents] = useState<any[]>([]);
  const [recentCourses,setRecentCourses] = useState<any[]>([]);
  const [recentFaculty, setRecentFaculty] = useState<any[]>([])
  const getCurrentData = () => {
  let data:any[] = []

  if (activeTab === "students") data = students
  if (activeTab === "faculty") data = faculty
  if (activeTab === "courses") data = courses

  const sorted = [...data].sort((a,b)=>{
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })

  const start = (page - 1) * pageSize
  return sorted.slice(start, start + pageSize)
}

// ✅ AFTER function
const currentData = getCurrentData()

const totalPages = Math.ceil(
  (activeTab === "students" ? students.length :
   activeTab === "faculty" ? faculty.length :
   courses.length) / pageSize
)
  const fetchData = async () => {

    try{

      const studentsRes = await axios.get("http://127.0.0.1:8000/api/students/");
      const facultyRes = await axios.get("http://127.0.0.1:8000/api/faculty/");
      const coursesRes = await axios.get("http://127.0.0.1:8000/api/courses/");
      const attendanceRes = await axios.get("http://127.0.0.1:8000/api/attendance/");

      setStudents(studentsRes.data);
      setFaculty(facultyRes.data);
      setCourses(coursesRes.data);
      setAttendance(attendanceRes.data);

      buildDepartmentChart(studentsRes.data);
      buildAttendanceChart(attendanceRes.data, coursesRes.data);

    }
    catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchData();
  },[]);

  const buildDepartmentChart = (students:any[]) => {

    const map:any = {};

    students.forEach((s:any)=>{

      if(!map[s.department]) map[s.department] = 0;

      map[s.department]++;

    });

    const result = Object.keys(map).map(k=>({
      name:k,
      students:map[k]
    }));

    setDeptData(result);

  };

  const buildAttendanceChart = (attendance:any[], courses:any[]) => {

  const map:any = {};

  attendance.forEach((a:any)=>{

    const courseId = a.course;

    if(!map[courseId]) {
      map[courseId] = {
        present: 0,
        total: 0
      };
    }

    map[courseId].total++;

    if(a.status === "Present") {
      map[courseId].present++;
    }

  });

  const result = Object.keys(map).map((courseId)=>{

    const courseObj = courses.find((c:any)=>c.id == courseId);

    return {
      dept: courseObj ? courseObj.course_name : `Course ${courseId}`,
      attendance: Math.round(
        (map[courseId].present / map[courseId].total) * 100
      )
    };

  });

  // 🔥 SORT (professional look)
  result.sort((a,b)=>b.attendance - a.attendance);

  setAttendanceAnalytics(result);
};

  const attendanceRate = attendance.length
    ? Math.round(
        attendance.filter(a=>a.status==="Present").length / attendance.length * 100
      )
    : 0;

  const stats = [
    {
      title:"Total Students",
      value:students.length,
      subtitle:"From database",
      icon:Users
    },
    {
      title:"Total Faculty",
      value:faculty.length,
      subtitle:"Across departments",
      icon:GraduationCap
    },
    {
      title:"Total Courses",
      value:courses.length,
      subtitle:"Available courses",
      icon:BookOpen
    },
    {
      title:"Attendance Overview",
      value:`${attendanceRate}%`,
      subtitle:"Average across all",
      icon:ClipboardCheck
    }
  ];

  return (

  <AdminDashboardLayout>

    <p className="text-3xl font-normal text-muted-foreground mb-8">
      Admin Dashboard
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      {stats.map((s)=>(
        <div key={s.title} className="bg-card rounded-lg border border-border p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-muted-foreground">{s.title}</p>
              <p className="text-2xl font-semibold text-foreground mt-1 font-mono-data">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.subtitle}</p>
            </div>

            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <s.icon className="h-5 w-5 text-primary"/>
            </div>

          </div>

        </div>
      ))}

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-base font-medium text-foreground mb-4">
          Students by Department
        </h2>

        <ResponsiveContainer width="100%" height={280}>

          <PieChart>

            <Pie
  data={deptData}
  dataKey="students"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={100}
  paddingAngle={2}
>

              {deptData.map((_,i)=>(
                <Cell key={i} fill={COLORS[i % COLORS.length]}/>
              ))}

            </Pie>

            <Tooltip content={<CustomTooltip />} />
          

          </PieChart>

        </ResponsiveContainer>
      <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs w-full">
  {deptData.map((d, i) => {
    const total = deptData.reduce((sum, item) => sum + item.students, 0)
    const percent = ((d.students / total) * 100).toFixed(0)

    return (
      <div
        key={i}
        className="flex items-center justify-between gap-6 px-3 py-1.5 rounded-md bg-muted/20 min-w-[120px]"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          />
          <span className="text-muted-foreground">
            {d.name}
          </span>
        </div>

        {/* RIGHT SIDE */}
        <span className="text-foreground font-medium">
          {percent}%
        </span>
      </div>
    )
  })}
</div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-base font-medium text-foreground mb-4">
          Attendance Analytics
        </h2>

        <ResponsiveContainer width="100%" height={340}>

          <BarChart data={attendanceAnalytics}>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)"/>

            <XAxis dataKey="dept" tick={{fontSize:12}}/>

            <YAxis tick={{fontSize:12}} domain={[0,100]}/>

            <Tooltip formatter={(value) => `${value}%`} />

            <Bar dataKey="attendance" fill="hsl(217,91%,60%)" radius={[4,4,0,0]}/>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    <div className="bg-card rounded-xl border border-border p-6 h-[420px] flex flex-col">

  {/* 🔹 HEADER */}
  <div className="flex justify-between items-center mb-4">

    <h2 className="text-base font-medium text-foreground">
      Recent Registrations
    </h2>

    <div className="flex gap-2 text-xs">
      {["students","faculty","courses"].map((tab)=>(
        <button
          key={tab}
          onClick={()=>setActiveTab(tab as any)}
          className={`px-3 py-1.5 rounded-md transition ${
            activeTab === tab
              ? "bg-primary text-white shadow-sm"
              : "bg-muted hover:bg-muted/70"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

  </div>

  <div className="flex-1 overflow-auto">

  <table className="w-full text-sm table-fixed">

    <thead className="sticky top-0 bg-card z-10">
      <tr className="border-b border-border text-muted-foreground">

        <th className="w-[15%] text-left py-2">ID</th>

        <th className="w-[25%] text-left py-2">Name</th>

        <th className="w-[15%] text-left py-2">Dept</th>

        <th className="w-[20%] text-center py-2">
          {activeTab === "faculty" ? "Designation" :
           activeTab === "courses" ? "Semester" : "Year"}
        </th>

        <th className="w-[25%] text-left py-2">Date</th>

      </tr>
    </thead>

    <tbody className="text-sm">

      {currentData.map((item) => {

        if (activeTab === "students") {
          const s = item
          return (
            <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition">

              <td className="py-2.5 text-primary font-medium">
                {s.id}
              </td>

              <td className="py-2.5 truncate">
                {s.name}
              </td>

              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDeptColor(s.department)}`}>
                  {s.department}
                </span>
              </td>

              <td className="py-2.5 text-center tabular-nums">
                {s.year}
              </td>

              <td className="py-2.5 text-muted-foreground">
                {s.created_at
                  ? new Date(s.created_at).toLocaleDateString()
                  : "—"}
              </td>

            </tr>
          )
        }

        if (activeTab === "faculty") {
          const f = item
          return (
            <tr key={f.id} className="border-b border-border hover:bg-muted/30 transition">

              <td className="py-2.5 text-primary font-medium">
                FAC{f.id?.toString().padStart(3,"0")}
              </td>

              <td className="py-2.5 truncate">
                {f.name}
              </td>

              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDeptColor(f.department)}`}>
                  {f.department}
                </span>
              </td>

              <td className="py-2.5 text-left truncate max-w-[140px]">
                {f.designation}
              </td>

              <td className="py-2.5 text-muted-foreground">
                {f.created_at
                  ? new Date(f.created_at).toLocaleDateString()
                  : "—"}
              </td>

            </tr>
          )
        }

        if (activeTab === "courses") {
          const c = item
          return (
            <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition">

              <td className="py-2.5 text-primary font-medium">
                {c.course_code}
              </td>

              <td className="py-2.5 truncate">
                {c.course_name}
              </td>

              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDeptColor(c.department)}`}>
                  {c.department}
                </span>
              </td>

              <td className="py-2.5 text-center tabular-nums">
                {c.semester}
              </td>

              <td className="py-2.5 text-muted-foreground">
                {c.created_at
                  ? new Date(c.created_at).toLocaleDateString()
                  : "—"}
              </td>

            </tr>
          )
        }

      })}

    </tbody>

  </table>

  {/* 🔥 PAGINATION (MATCHED WITH FACULTY PAGE) */}
  <div className="flex justify-between items-center mt-4">

    <p className="text-sm text-muted-foreground">
      Page {page} of {totalPages}
    </p>

    <div className="flex gap-2">

      <button
        onClick={()=>setPage(p=>Math.max(p-1,1))}
        disabled={page===1}
        className={`px-4 py-2 rounded-lg text-sm font-medium 
        flex items-center gap-1 border transition-all duration-200

        ${page===1
          ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
          : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md"
        }`}
      >
        ← Prev
      </button>

      <button
        onClick={()=>setPage(p=>Math.min(p+1,totalPages))}
        disabled={page===totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium 
        flex items-center gap-1 border transition-all duration-200

        ${page===totalPages
          ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
          : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md"
        }`}
      >
        Next →
      </button>

    </div>

  </div>

</div>

</div>
  </AdminDashboardLayout>

  );
};

export default AdminDashboard;