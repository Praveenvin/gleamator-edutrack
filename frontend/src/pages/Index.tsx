import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, ClipboardCheck, FileText, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = {
  submitted: "#2563eb",  // strong blue
  pending: "#f43f5e"     // modern red (not dull)
};

const STUDENT_ID = 103;

const Index = () => {

  const [stats,setStats] = useState<any[]>([]);
  const [materials,setMaterials] = useState<any[]>([]);
  const [notifications,setNotifications] = useState<any[]>([]);
  const [leaveRequests,setLeaveRequests] = useState<any[]>([]);
  const shortName = (name: string) => {
  if (!name) return "";

  // if already short → keep it
  if (name.length <= 12) return name;

  // convert to initials (DBMS, ML, DS)
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
};
  const [attendanceData,setAttendanceData] = useState<any[]>([]);
  const [assignmentData,setAssignmentData] = useState<any[]>([]);

  useEffect(()=>{
    fetchDashboard();
  },[]);

  const fetchDashboard = async () => {

    try{

      const attendanceRes = await axios.get(
        `http://127.0.0.1:8000/api/attendance/?student=${STUDENT_ID}`
      );

      const assignmentRes = await axios.get(
        `http://127.0.0.1:8000/api/assignments/?student=${STUDENT_ID}`
      );

      const materialRes = await axios.get(
        "http://127.0.0.1:8000/api/materials/"
      );

      const notificationRes = await axios.get(
        "http://127.0.0.1:8000/api/notifications/"
      );

      const attendance = attendanceRes.data || [];
      const assignments = assignmentRes.data || [];

      /* ---------- ATTENDANCE CALCULATION ---------- */

      const courseMap:any = {};

      attendance.forEach((a:any)=>{

        const subject = a.course_name || `Course ${a.course}`;

        if(!courseMap[subject]){
          courseMap[subject] = {
            subject,
            total:0,
            attended:0
          };
        }

        courseMap[subject].total += 1;

        if(a.status === "Present"){
          courseMap[subject].attended += 1;
        }

      });

      const attendanceSummary:any[] = Object.values(courseMap);

      const totalClasses:number = attendanceSummary.reduce(
        (sum:number,c:any)=>sum + Number(c.total),
        0
      );

      const attended:number = attendanceSummary.reduce(
        (sum:number,c:any)=>sum + Number(c.attended),
        0
      );

      const percent:string =
        totalClasses > 0
          ? ((attended / totalClasses) * 100).toFixed(1)
          : "0";

      /* ---------- DASHBOARD STATS ---------- */

      const pendingAssignments = assignments.filter(
        (a:any)=>a.status === "Pending"
      ).length;

      setStats([
        {
          title:"Today's Lectures",
          value:"5",
          subtitle:"Schedule loaded",
          icon:BookOpen
        },
        {
          title:"Attendance Status",
          value:`${percent}%`,
          subtitle:"Calculated from attendance",
          icon:ClipboardCheck
        },
        {
          title:"Pending Assignments",
          value:pendingAssignments,
          subtitle:"From assignments",
          icon:FileText
        },
        {
          title:"Unread Announcements",
          value:notificationRes.data?.length || 0,
          subtitle:"From notifications",
          icon:Bell
        }
      ]);

      /* ---------- ATTENDANCE CHART ---------- */

      const chartData = attendanceSummary.map((c:any)=>({
        subject:c.subject,
        attendance: Math.round((c.attended / c.total) * 100)
      }));

      setAttendanceData(chartData);

      /* ---------- ASSIGNMENT CHART ---------- */

      const assignmentStats:any = {};

assignments.forEach((a:any)=>{

  // ✅ use proper course name
  const subject = a.subject || "Unknown";

  if(!assignmentStats[subject]){
    assignmentStats[subject] = {
      subject,
      Submitted:0,
      Pending:0
    };
  }

  if(a.status === "Submitted"){
    assignmentStats[subject].Submitted +=1;
  }

  if(a.status === "Pending"){
    assignmentStats[subject].Pending +=1;
  }

});

setAssignmentData(Object.values(assignmentStats));

      /* ---------- MATERIALS & NOTIFICATIONS ---------- */

      setMaterials(materialRes.data?.slice(0,3) || []);
      setNotifications(notificationRes.data?.slice(0,4) || []);
      setLeaveRequests([]);

    }
    catch(err){
      console.error("Dashboard load error:",err);
    }

  };

  return (
    <DashboardLayout>

      <p className="text-3xl font-normal text-muted-foreground mb-8">
        Welcome back
      </p>

      {/* ---------- STAT CARDS ---------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {stats.map((s)=>(

          <div key={s.title} className="bg-card rounded-lg border border-border p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-muted-foreground">{s.title}</p>

                <p className="text-2xl font-semibold text-foreground mt-1 font-mono-data">
                  {s.value}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {s.subtitle}
                </p>

              </div>

              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary"/>
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ---------- CHARTS ---------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Attendance Chart */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Attendance Report
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <LineChart data={attendanceData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis 
  dataKey="subject"
  tickFormatter={shortName}
/>

              <YAxis domain={[0,100]}/>

              <Tooltip/>

              <Legend/>

              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{r:5}}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Assignment Chart */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Assignment Progress
          </h2>

          <ResponsiveContainer width="100%" height={280}>
  <BarChart 
  data={assignmentData} 
  barCategoryGap="30%"   // spacing between groups
  barGap={6}            // spacing inside group
>

    <CartesianGrid 
  strokeDasharray="3 3" 
  vertical={false} 
  stroke="#e5e7eb"
/>

    <XAxis 
  dataKey="subject"
  tickFormatter={shortName}
/>
    <YAxis allowDecimals={false} />

    <Tooltip
  contentStyle={{
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  }}
/>

    <Legend />

   <Bar 
  dataKey="Submitted" 
  fill={COLORS.submitted}
  radius={[8, 8, 0, 0]}
/>

<Bar 
  dataKey="Pending" 
  fill={COLORS.pending}
  radius={[8, 8, 0, 0]}
/>

  </BarChart>
</ResponsiveContainer>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Index;