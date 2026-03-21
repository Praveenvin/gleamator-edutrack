import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { BookOpen, FileText, Users, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,PieChart, Pie, Cell, Legend
} from "recharts";

const API = "http://127.0.0.1:8000/api";

const COLORS = [
  "hsl(217,91%,60%)",
  "hsl(142,72%,29%)",
  "hsl(25,95%,53%)",
  "hsl(0,72%,51%)"
];
const FacultyDashboard = () => {

  const facultyId = Number(localStorage.getItem("faculty_id"));

  const [stats, setStats] = useState<any[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [courseGraph, setCourseGraph] = useState<any[]>([]);
  const [coursesData, setCoursesData] = useState<any[]>([]);

  const getGrade = (s:{IA1:number, IA2:number, FINAL:number}) => {

  const ia1 = s.IA1 || 0;
  const ia2 = s.IA2 || 0;
  const final = s.FINAL || 0;

  // ================= FINAL AVAILABLE =================
  if (final > 0) {
    if (final >= 90) return "A";
    if (final >= 75) return "B";
    if (final >= 60) return "C";
    return "D";
  }

  // ================= IA1 + IA2 =================
  if (ia1 > 0 && ia2 > 0) {
    const avg = (ia1 + ia2) / 2;

    if (avg >= 35) return "A";
    if (avg >= 28) return "B";
    if (avg >= 20) return "C";
    return "D";
  }

  // ================= ONLY IA1 =================
  if (ia1 > 0) {
    if (ia1 >= 35) return "A";
    if (ia1 >= 28) return "B";
    if (ia1 >= 20) return "C";
    return "D";
  }

  return "D";
};

  const fetchDashboard = async () => {
    try {

      const [coursesRes, assignmentsRes, marksRes] = await Promise.all([
        axios.get(`${API}/courses/`),
        axios.get(`${API}/assignments/`),
        axios.get(`${API}/marks/`)
      ]);

      const courses = coursesRes.data;
      const assignments = assignmentsRes.data;
      const marks = marksRes.data;

      setCoursesData(courses);

      const myCourses = courses.filter((c:any)=>c.faculty == facultyId);
      const courseIds = myCourses.map((c:any)=>c.id);

      const myAssignments = assignments.filter((a:any)=>
        Array.isArray(a.faculty)
          ? a.faculty.includes(facultyId)
          : a.faculty == facultyId
      );

      const myMarks = marks.filter((m:any)=>
        courseIds.includes(m.course)
      );

      // ================= STATS =================
      setStats([
        { title:"My Courses", value:myCourses.length, subtitle:"Active courses", icon:BookOpen },
        { title:"Assignments", value:myAssignments.length, subtitle:"Assigned by you", icon:FileText },
        { title:"Students", value:new Set(myMarks.map((m:any)=>m.student)).size, subtitle:"Across courses", icon:Users },
        { title:"Evaluations", value:myMarks.length, subtitle:"Marks recorded", icon:ClipboardCheck }
      ]);

      // ================= ASSIGNMENTS =================
      setRecentAssignments(
        myAssignments.sort((a:any,b:any)=> new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0,5)
      );

      // ================= STUDENT PERFORMANCE =================
      const studentMap:any = {};
      myMarks.forEach((m:any)=>{
        if(!studentMap[m.student]) studentMap[m.student] = [];
        studentMap[m.student].push(m.marks);
      });

      const avgPerformance = Object.keys(studentMap).map((sid)=>({
        student:sid,
        marks:Math.round(studentMap[sid].reduce((a:number,b:number)=>a+b,0)/studentMap[sid].length)
      }));

      setStudentPerformance(avgPerformance.slice(0,5));

      // ================= GRADE GRAPH =================
      // ================= FIXED GRADE GRAPH =================

// ================= FIXED GRADE GRAPH =================

// 1. group by student
const studentTotals:any = {};

myMarks.forEach((m:any)=>{
  if(!studentTotals[m.student]){
    studentTotals[m.student] = { IA1:0, IA2:0, FINAL:0 };
  }

  studentTotals[m.student][m.exam_type] = m.marks;
});

// 2. calculate grade per student
const gradeCount:any = {};

Object.keys(studentTotals).forEach((sid)=>{
  const s = studentTotals[sid];

  const g = getGrade(s); // ✅ CORRECT
  gradeCount[g] = (gradeCount[g] || 0) + 1;
});
      const order = ["A","B","C","D"];

      setGraphData(order.map(g=>({
        grade:g,
        count:gradeCount[g] || 0
      })));

      // ================= COURSE GRAPH =================
      // ================= FIXED COURSE GRAPH =================

// 1. group by course + student
const courseStudentMap:any = {};

myMarks.forEach((m:any)=>{
  if(!courseStudentMap[m.course]){
    courseStudentMap[m.course] = {};
  }

  if(!courseStudentMap[m.course][m.student]){
    courseStudentMap[m.course][m.student] = { IA1:0, IA2:0, FINAL:0 };
  }

  courseStudentMap[m.course][m.student][m.exam_type] = m.marks;
});

// 2. calculate avg per course
const courseAvg:any = {};

Object.keys(courseStudentMap).forEach((cid)=>{
  const students = courseStudentMap[cid];

  const values:number[] = [];

  Object.keys(students).forEach((sid)=>{
    const s = students[sid];

    // 🔥 same logic as grading
    if (s.FINAL > 0) {
      values.push(s.FINAL);
    } else if (s.IA1 > 0 && s.IA2 > 0) {
      values.push((s.IA1 + s.IA2) / 2);
    } else if (s.IA1 > 0) {
      values.push(s.IA1);
    }
  });

  const avg =
    values.length > 0
      ? Math.round(values.reduce((a,b)=>a+b,0) / values.length)
      : 0;

  courseAvg[cid] = avg;
});

// 3. set graph
setCourseGraph(
  Object.keys(courseAvg).map(cid=>({
    course:Number(cid),
    avg:courseAvg[cid]
  }))
);

    } catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{ fetchDashboard(); },[]);

  // ================= COURSE MAP =================
  const courseMap:any = {};
  coursesData.forEach((c:any)=>{ courseMap[c.id] = c.course_name });

  const courseChart = courseGraph.map((c:any)=>({
    name: courseMap[c.course] || `Course ${c.course}`,
    avg: c.avg
  }));

  return (
    <FacultyDashboardLayout>

      <p className="text-3xl font-normal text-muted-foreground mb-8">
        Faculty Dashboard
      </p>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {stats.map((s)=>(
          <div key={s.title} className="bg-card rounded-lg border border-border p-6">

            <div className="flex justify-between">

              <div>
                <p className="text-sm text-muted-foreground">{s.title}</p>
                <p className="text-2xl font-semibold mt-1 font-mono-data">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.subtitle}</p>
              </div>

              <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary"/>
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* GRADE GRAPH */}
        <div className="bg-card rounded-lg border border-border p-6">

  <h2 className="text-base font-medium text-foreground mb-4">
    Grade Distribution
  </h2>

  <ResponsiveContainer width="100%" height={280}>

    <PieChart>

      <Pie
        data={graphData}
        dataKey="count"
        nameKey="grade"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label   // ✅ same as admin
      >

        {graphData.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}

      </Pie>

      <Tooltip />
      <Legend />

    </PieChart>

  </ResponsiveContainer>

</div>
        {/* COURSE GRAPH */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium mb-4">
            Course Performance
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseChart} layout="vertical">

              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)"/>

              <XAxis type="number"/>
              <YAxis type="category" dataKey="name" width={160}/>
              <Tooltip/>

              <Bar dataKey="avg" fill="hsl(217,91%,60%)" radius={[0,4,4,0]}/>

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= TABLES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium mb-4">Recent Assignments</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Due</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((a:any)=>(
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="py-2.5">{a.title}</td>
                  <td className="py-2.5 text-muted-foreground">{a.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium mb-4">Student Performance</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Student</th>
                <th className="text-left py-2">Avg Marks</th>
              </tr>
            </thead>
            <tbody>
              {studentPerformance.map((s:any)=>(
                <tr key={s.student} className="border-b border-border last:border-0">
                  <td className="py-2.5">{s.student}</td>
                  <td className="py-2.5 text-primary font-medium">{s.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyDashboard;