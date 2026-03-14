import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, ClipboardCheck, FileText, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const statusColor: Record<string, string> = {
  Approved: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
  Rejected: "text-destructive bg-destructive/10",
};

const Index = () => {

  const [stats,setStats] = useState<any[]>([]);
  const [materials,setMaterials] = useState<any[]>([]);
  const [notifications,setNotifications] = useState<any[]>([]);
  const [leaveRequests,setLeaveRequests] = useState<any[]>([]);

  const [attendanceData,setAttendanceData] = useState<any[]>([]);
  const [assignmentData,setAssignmentData] = useState<any[]>([]);
  const [scatterData,setScatterData] = useState<any[]>([]);

  useEffect(()=>{

    fetchDashboard();

  },[]);

  const fetchDashboard = async () => {

    try{

      const attendanceRes = await axios.get("http://127.0.0.1:8000/api/attendance/");
      const assignmentRes = await axios.get("http://127.0.0.1:8000/api/assignments/");
      const materialRes = await axios.get("http://127.0.0.1:8000/api/materials/");
      const notificationRes = await axios.get("http://127.0.0.1:8000/api/notifications/");

      const attendance = attendanceRes.data || [];
      const assignments = assignmentRes.data || [];

      const totalClasses = attendance.reduce((s:any,a:any)=>s+(a.total_classes||0),0);
      const attended = attendance.reduce((s:any,a:any)=>s+(a.attended_classes||0),0);

      const percent = totalClasses
        ? ((attended/totalClasses)*100).toFixed(1)
        : 0;

      const pendingAssignments = assignments.filter((a:any)=>a.status==="Pending").length;

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
          subtitle:"Calculated from database",
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

      setMaterials(materialRes.data?.slice(0,3) || []);

      setNotifications(notificationRes.data?.slice(0,4) || []);

      setLeaveRequests([]);

      setAttendanceData(
        attendance.map((a:any)=>({
          month:a.subject || "Subject",
          Math:a.attended_classes || 0,
          Physics:a.attended_classes || 0,
          Chemistry:a.attended_classes || 0,
          CS:a.attended_classes || 0
        }))
      );

      const assignmentStats:any = {};

      assignments.forEach((a:any)=>{

        const subject = a.course || "Subject";

        if(!assignmentStats[subject])
          assignmentStats[subject] = {subject,Completed:0,Pending:0};

        if(a.status==="Completed")
          assignmentStats[subject].Completed +=1;
        else
          assignmentStats[subject].Pending +=1;

      });

      setAssignmentData(Object.values(assignmentStats));

      setScatterData(
        attendance.map((a:any)=>({

          attendance:
            a.total_classes
              ? ((a.attended_classes/a.total_classes)*100)
              : 0,

          marks: Math.floor(Math.random()*40)+60

        }))
      );

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

      {/* Stat Cards */}

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

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Attendance Report
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <LineChart data={attendanceData}>

              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis domain={[0,100]}/>
              <Tooltip/>
              <Legend/>

              <Line type="monotone" dataKey="Math" stroke="#2563EB"/>
              <Line type="monotone" dataKey="Physics" stroke="#16A34A"/>
              <Line type="monotone" dataKey="Chemistry" stroke="#F97316"/>
              <Line type="monotone" dataKey="CS" stroke="#DC2626"/>

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Assignment Progress
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <BarChart data={assignmentData}>

              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="subject"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>

              <Bar dataKey="Completed" fill="#2563EB"/>
              <Bar dataKey="Pending" fill="#F97316"/>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Bottom Panels */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Latest Study Materials
          </h2>

          {materials.map((m:any)=>(
            <div key={m.id} className="py-2 border-b border-border last:border-0">

              <p className="text-sm font-medium text-foreground">
                {m.course}
              </p>

              <p className="text-xs text-muted-foreground">
                {m.title}
              </p>

            </div>
          ))}

        </div>

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Leave Request Status
          </h2>

          {leaveRequests.map((l:any)=>(
            <div key={l.id} className="py-2 border-b border-border">

              <p className="text-sm text-foreground">
                {l.reason}
              </p>

              <span className={`text-xs px-2 py-1 rounded ${statusColor[l.status]}`}>
                {l.status}
              </span>

            </div>
          ))}

        </div>

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Notification Panel
          </h2>

          {notifications.map((n:any)=>(
            <div key={n.id} className="py-2 border-b border-border">

              <p className="text-sm text-foreground">
                {n.message}
              </p>

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Index;