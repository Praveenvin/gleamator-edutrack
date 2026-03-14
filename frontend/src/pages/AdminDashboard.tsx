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

  const [deptData,setDeptData] = useState<any[]>([]);
  const [attendanceAnalytics,setAttendanceAnalytics] = useState<any[]>([]);

  const [recentStudents,setRecentStudents] = useState<any[]>([]);
  const [recentCourses,setRecentCourses] = useState<any[]>([]);

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
      buildAttendanceChart(attendanceRes.data);

      setRecentStudents(studentsRes.data.slice(-5).reverse());
      setRecentCourses(coursesRes.data.slice(-5).reverse());

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

  const buildAttendanceChart = (attendance:any[]) => {

    const map:any = {};

    attendance.forEach((a:any)=>{

      if(!map[a.course]) map[a.course] = {present:0,total:0};

      map[a.course].total++;

      if(a.status === "Present") map[a.course].present++;

    });

    const result = Object.keys(map).map(c=>({

      dept:`Course ${c}`,
      attendance:Math.round((map[c].present/map[c].total)*100)

    }));

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
              label
            >

              {deptData.map((_,i)=>(
                <Cell key={i} fill={COLORS[i % COLORS.length]}/>
              ))}

            </Pie>

            <Tooltip/>
            <Legend/>

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-base font-medium text-foreground mb-4">
          Attendance Analytics
        </h2>

        <ResponsiveContainer width="100%" height={280}>

          <BarChart data={attendanceAnalytics}>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)"/>

            <XAxis dataKey="dept" tick={{fontSize:12}}/>

            <YAxis tick={{fontSize:12}} domain={[60,100]}/>

            <Tooltip/>

            <Bar dataKey="attendance" fill="hsl(217,91%,60%)" radius={[4,4,0,0]}/>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-base font-medium text-foreground mb-4">
          Recent Student Registrations
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Dept</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Year</th>
            </tr>
          </thead>

          <tbody>

            {recentStudents.map((s)=>(
              <tr key={s.id} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono-data text-primary">{s.id}</td>
                <td className="py-2.5 text-foreground">{s.name}</td>
                <td className="py-2.5 text-muted-foreground">{s.department}</td>
                <td className="py-2.5 text-muted-foreground">{s.year}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-base font-medium text-foreground mb-4">
          Recent Course Updates
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Code</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Department</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Semester</th>
            </tr>
          </thead>

          <tbody>

            {recentCourses.map((c)=>(
              <tr key={c.id} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono-data text-primary">{c.course_code}</td>
                <td className="py-2.5 text-foreground">{c.course_name}</td>
                <td className="py-2.5 text-muted-foreground">{c.department}</td>
                <td className="py-2.5 text-muted-foreground">{c.semester}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  </AdminDashboardLayout>

  );
};

export default AdminDashboard;