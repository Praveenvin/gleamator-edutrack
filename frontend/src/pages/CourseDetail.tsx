import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
  YAxis
} from "recharts";
import { ArrowLeft } from "lucide-react";

const COLORS = [
  "hsl(217,91%,60%)",
  "hsl(142,72%,29%)",
  "hsl(25,95%,53%)",
  "hsl(0,72%,51%)",
  "hsl(262,52%,47%)"
];

const AdminCourseDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data,setData] = useState<any>(null);
  const [activeTab,setActiveTab] = useState("overview");

  useEffect(()=>{
    fetchData();
  },[id]);

  const fetchData = async ()=>{
    const res = await axios.get(
      `http://127.0.0.1:8000/api/course-full/?id=${id}`
    );
    setData(res.data);
  };

  if(!data) return <p className="p-6">Loading...</p>;

  const { course, overview, students, attendance, marks, assignments } = data;

  return (
    <AdminDashboardLayout>

      {/* 🔙 BACK */}
      <button
        onClick={()=>navigate(-1)}
        className="flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16}/> Back
      </button>

      {/* 🔥 HEADER */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold">{course.name}</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm">

          <Info label="Code" value={course.code}/>
          <Info label="Department" value={course.department}/>
          <Info label="Semester" value={course.semester}/>
          <Info label="Faculty" value={course.faculty_name}/>
          <Info label="Students" value={overview.total_students}/>

        </div>

      </div>

      {/* 🔥 TABS */}
      <div className="flex gap-4 mb-6 border-b">
        {["overview","students","attendance","marks","assignments"].map(tab=>(
          <button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`pb-2 text-sm ${
              activeTab===tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab==="overview" && (
        <div className="grid md:grid-cols-4 gap-4">

          <Stat title="Students" value={overview.total_students}/>
          <Stat title="Attendance" value={`${overview.overall_attendance}%`}/>
          <Stat title="Avg Marks" value={overview.avg_marks}/>
          <Stat title="Pending Eval" value={overview.pending_evaluation} highlight/>

          {/* 🔥 GRAPH */}
          <div className="col-span-4 bg-card border rounded-xl p-6">

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendance} barCategoryGap="40%">
                <XAxis dataKey="student"/>
                <YAxis domain={[0,100]}/>
                <Tooltip/>

                <Bar dataKey="percentage" radius={[6,6,0,0]}>
                  {attendance.map((_:any,i:number)=>(
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>
      )}

      {/* ================= STUDENTS ================= */}
      {activeTab==="students" && (
        <Table
          headers={["Name","USN","Department","Year"]}
          data={students.map((s:any)=>[
            s.name,
            s.usn,
            <Badge>{s.department}</Badge>,
            s.year
          ])}
        />
      )}

      {/* ================= ATTENDANCE ================= */}
      {activeTab==="attendance" && (
        <div className="space-y-4">
          {attendance.map((a:any,i:number)=>(
            <div key={i} className="bg-card p-4 border rounded-xl">

              <div className="flex justify-between text-sm mb-2">
                <span>{a.student}</span>
                <span>{a.percentage}%</span>
              </div>

              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width:`${a.percentage}%`,
                    background: COLORS[i % COLORS.length]
                  }}
                />
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================= MARKS ================= */}
      {activeTab==="marks" && (
        <Table
          headers={["Student","USN","IA1","IA2","Final"]}
          data={marks.map((m:any)=>[
            m.student,
            m.usn,
            m.IA1 ?? "-",
            m.IA2 ?? "-",
            m.FINAL ?? "-"
          ])}
        />
      )}

      {/* ================= ASSIGNMENTS ================= */}
      {activeTab==="assignments" && (
        <Table
          headers={["Title","Submitted","Evaluated","Pending","Due Date"]}
          data={assignments.map((a:any)=>[
            a.title,
            a.submitted,
            a.evaluated,
            <Status status={a.pending > 0 ? "Pending" : "Completed"} />,
            a.due_date
          ])}
        />
      )}

    </AdminDashboardLayout>
  );
};

export default AdminCourseDetail;

/* ================= UI ================= */

const Info = ({label,value}:any)=>(
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Stat = ({title,value,highlight=false}:any)=>(
  <div className={`p-5 border rounded-xl ${
    highlight ? "border-primary shadow" : "border-border"
  }`}>
    <p className="text-xs text-muted-foreground">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

const Badge = ({children}:any)=>(
  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
    {children}
  </span>
);

const Status = ({status}:any)=>{
  const map:any = {
    Pending:"bg-yellow-100 text-yellow-700",
    Completed:"bg-green-100 text-green-700"
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${map[status]}`}>
      {status}
    </span>
  );
};

const Table = ({headers,data}:any)=>(
  <div className="bg-card border rounded-xl overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr>
          {headers.map((h:any,i:number)=>(
            <th key={i} className="px-4 py-3 text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row:any,i:number)=>(
          <tr key={i} className="border-t hover:bg-muted/30">
            {row.map((cell:any,j:number)=>(
              <td key={j} className="px-4 py-3">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);