import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
Cell
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

interface Attendance{
id:number;
student:number;
course:number;
date:string;
status:string;
}

interface Course{
id:number;
course_name:string;
}

const ATTENDANCE_API="http://127.0.0.1:8000/api/attendance/";
const COURSE_API="http://127.0.0.1:8000/api/courses/";

const colors=[
"#3b82f6",
"#10b981",
"#f59e0b",
"#8b5cf6",
"#ef4444",
"#14b8a6",
"#6366f1",
"#ec4899"
];

const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminAttendance=()=>{

const[attendance,setAttendance]=useState<Attendance[]>([]);
const[courses,setCourses]=useState<Course[]>([]);
const[data,setData]=useState<any[]>([]);
const[monthFilter,setMonthFilter]=useState("");

/* ---------------- FETCH ---------------- */

const fetchData=async()=>{
try{
const[aRes,cRes]=await Promise.all([
axios.get(ATTENDANCE_API),
axios.get(COURSE_API)
]);

setAttendance(aRes.data);
setCourses(cRes.data);

}catch(err){
console.error(err);
}
};

useEffect(()=>{
fetchData();
},[]);

/* ---------------- FILTER ---------------- */

const getFilteredData=()=>{

let filtered=[...attendance];

if(monthFilter){
filtered=filtered.filter(a=>{
const m=new Date(a.date).getMonth()+1;
return m===Number(monthFilter);
});
}

return filtered;

};

/* ---------------- PROCESS ---------------- */

const generateData=()=>{

const filtered=getFilteredData();

const map:any={};

filtered.forEach(a=>{

const cname=courses.find(c=>c.id===a.course)?.course_name;
if(!cname) return;

if(!map[cname]){
map[cname]={course:cname,total:0,present:0};
}

map[cname].total++;

if(a.status==="Present"){
map[cname].present++;
}

});

const result=Object.values(map).map((r:any)=>({
course:r.course,
attendance:Math.round((r.present/r.total)*100),
total:r.total,
present:r.present
})).sort((a:any,b:any)=>b.attendance-a.attendance);

setData(result);

};

useEffect(()=>{
generateData();
},[attendance,courses,monthFilter]);

/* ---------------- STATS ---------------- */

const total=attendance.length;
const present=attendance.filter(a=>a.status==="Present").length;
const overall=total?Math.round((present/total)*100):0;
const absentees=attendance.filter(a=>a.status==="Absent").length;
const lowAttendance=data.filter((d:any)=>d.attendance<75).length;

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload }: any) => {

if (!active || !payload || !payload.length) return null;

const item = payload[0];

return (
<div className="bg-white border shadow-md rounded-lg px-3 py-2 text-sm">
<p className="font-medium">{item.payload.course}</p>
<p style={{color:item.color}}>
Attendance: {item.value}%
</p>
</div>
);

};

/* ---------------- UI ---------------- */

return(

<AdminDashboardLayout>

<h1 className="text-2xl font-semibold text-foreground mb-6">
Attendance Management
</h1>

{/* FILTER */}

<div className="flex flex-wrap items-center gap-4 mb-6">

<select
value={monthFilter}
onChange={(e)=>setMonthFilter(e.target.value)}
className="border border-border px-4 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
>
<option value="">All Months</option>
{months.map((m,i)=>(
<option key={i} value={i+1}>{m}</option>
))}
</select>

</div>

{/* CARDS */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

{[
{label:"Overall Attendance",value:`${overall}%`,sub:"All courses"},
{label:"Low Attendance Alerts",value:lowAttendance,sub:"Below 75%"},
{label:"Total Absentees",value:absentees,sub:"Across courses"}
].map(c=>(
<div key={c.label} className="bg-card rounded-lg border border-border p-6">
<p className="text-sm text-muted-foreground">{c.label}</p>
<p className="text-3xl font-bold mt-1">{c.value}</p>
<p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
</div>
))}

</div>

{/* TABLE */}

<div className="bg-card rounded-lg border border-border overflow-hidden mb-6">

<table className="w-full text-sm">

<thead className="bg-secondary/50">
<tr>
{["Course","Total","Present","Attendance %"].map(h=>(
<th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">
{h}
</th>
))}
</tr>
</thead>

<tbody>

{data.map((d:any)=>(
<tr key={d.course} className="border-t border-border hover:bg-secondary/40 transition">

<td className="px-4 py-3 font-medium text-foreground">
{d.course}
</td>

<td className="px-4 py-3">{d.total}</td>

<td className="px-4 py-3">{d.present}</td>

<td className="px-4 py-3">

<span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
d.attendance>=85
? "bg-emerald-100 text-emerald-700"
: "bg-red-100 text-red-700"
}`}>
{d.attendance}%
</span>

</td>

</tr>
))}

</tbody>

</table>

</div>

{/* GRAPH */}

<div className="bg-card rounded-lg border border-border p-6">

<h2 className="text-lg font-semibold text-foreground mb-4">
Attendance by Course
</h2>

<ResponsiveContainer width="100%" height={320}>

<BarChart data={data} layout="vertical">

<CartesianGrid strokeDasharray="3 3" />

<XAxis type="number" domain={[0,100]} />

<YAxis
type="category"
dataKey="course"
width={200}
/>

<Tooltip content={<CustomTooltip />} />

{/* GRADIENT */}

<defs>
{colors.map((color,i)=>(
<linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stopColor={color} stopOpacity={0.7}/>
<stop offset="100%" stopColor={color} stopOpacity={1}/>
</linearGradient>
))}
</defs>

<Bar dataKey="attendance" radius={[0,10,10,0]}>

{data.map((entry,index)=>(
<Cell
key={index}
fill={`url(#grad${index % colors.length})`}
/>
))}

</Bar>

</BarChart>

</ResponsiveContainer>

</div>

</AdminDashboardLayout>

);

};

export default AdminAttendance;