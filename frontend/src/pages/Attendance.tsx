import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface AttendanceRow {
  id: number;
  subject: string;
  total: number;
  attended: number;
  percentage: number;
}

const Attendance = () => {
  const navigate = useNavigate();
  const [data,setData] = useState<AttendanceRow[]>([]);
  const [overall,setOverall] = useState<number>(0);

  useEffect(()=>{
    fetchAttendance();
  },[]);

  const fetchAttendance = async () => {

    try{

      const studentId = 103;

      const res = await axios.get(
        `http://127.0.0.1:8000/api/attendance/?student=${studentId}`
      );

      const rows = res.data;

      const courseMap:any = {};

      rows.forEach((r:any)=>{

        const course = r.course;

        if(!courseMap[course]){
          courseMap[course] = {
            id: course,
            subject:r.course_name || `Course ${course}`,
            total:0,
            attended:0
          };
        }

        courseMap[course].total += 1;

        if(r.status === "Present"){
          courseMap[course].attended += 1;
        }

      });

      const formatted = Object.values(courseMap).map((c:any)=>{

        const percent =
          c.total > 0
            ? Math.round((c.attended / c.total) * 100)
            : 0;

        return {
          id: c.id,
          subject:c.subject,
          total:c.total,
          attended:c.attended,
          percentage:percent
        };

      });

      setData(formatted);

      // overall attendance
      const totalClasses = formatted.reduce((sum:any,r:any)=>sum+r.total,0);
      const totalAttended = formatted.reduce((sum:any,r:any)=>sum+r.attended,0);

      const overallPercent =
        totalClasses > 0
          ? Math.round((totalAttended / totalClasses) * 100)
          : 0;

      setOverall(overallPercent);

    }
    catch(err){

      console.error("Attendance fetch error:",err);

    }

  };

  return (
  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Attendance
    </h1>

{/* Overall Attendance Card */}

<div className="mb-6 bg-card border rounded-lg p-5 flex items-center justify-between">

  <div>
    <h2 className="text-sm text-muted-foreground">Overall Attendance</h2>
    <p className="text-3xl font-semibold">{overall}%</p>
  </div>

  <div className="w-40 h-3 bg-gray-200 rounded">
    <div
      className={`h-3 rounded ${
        overall >= 75
          ? "bg-green-500"
          : overall >= 50
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
      style={{width:`${overall}%`}}
    />
  </div>

</div>


{/* Table */}

<div className="bg-card rounded-lg border border-border overflow-hidden">

<table className="w-full text-sm">

<thead>

<tr className="border-b border-border bg-secondary/50">

<th className="text-left px-6 py-3 font-medium text-muted-foreground">
Subject
</th>

<th className="text-left px-6 py-3 font-medium text-muted-foreground">
Total Classes
</th>

<th className="text-left px-6 py-3 font-medium text-muted-foreground">
Attended
</th>

<th className="text-left px-6 py-3 font-medium text-muted-foreground">
Percentage
</th>

</tr>

</thead>

<tbody>

{data.map((r,index)=>(

<tr
key={index}
className="border-b border-border last:border-0 hover:bg-secondary/30"
>

<td className="px-6 py-4 text-foreground font-medium">
  <span
  className="cursor-pointer text-foreground hover:opacity-70"
  onClick={() => navigate(`/student-dashboard/course/${r.id}`)}
>
  {r.subject}
</span>
</td>

<td className="px-6 py-4 font-mono-data text-foreground">
{r.total}
</td>

<td className="px-6 py-4 font-mono-data text-foreground">
{r.attended}
</td>

<td className="px-6 py-4">

<div className="flex items-center gap-3">

<div className="w-32 h-2 bg-gray-200 rounded">

<div
className={`h-2 rounded ${
r.percentage >= 75
? "bg-green-500"
: r.percentage >= 50
? "bg-yellow-500"
: "bg-red-500"
}`}
style={{width:`${r.percentage}%`}}
/>

</div>

<span className="font-semibold text-sm">
{r.percentage}%
</span>

</div>

{/* warning */}

{r.percentage < 75 && (
<div className="text-xs text-red-500 mt-1">
Low attendance
</div>
)}

</td>

</tr>

))}

</tbody>

</table>

</div>

</DashboardLayout>
  );
};

export default Attendance;