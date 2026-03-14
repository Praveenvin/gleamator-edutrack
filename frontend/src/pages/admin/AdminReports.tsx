import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminReports = () => {

  const [students,setStudents] = useState<any[]>([]);
  const [marks,setMarks] = useState<any[]>([]);
  const [attendance,setAttendance] = useState<any[]>([]);

  const [enrollmentData,setEnrollmentData] = useState<any[]>([]);
  const [performanceData,setPerformanceData] = useState<any[]>([]);
  const [passRate,setPassRate] = useState<any[]>([]);

  const fetchData = async () => {

    try {

      const studentsRes = await axios.get("http://127.0.0.1:8000/api/students/");
      const marksRes = await axios.get("http://127.0.0.1:8000/api/marks/");
      const attendanceRes = await axios.get("http://127.0.0.1:8000/api/attendance/");

      setStudents(studentsRes.data);
      setMarks(marksRes.data);
      setAttendance(attendanceRes.data);

      generateEnrollment(studentsRes.data);
      generatePerformance(marksRes.data);
      generatePassRate(marksRes.data);

    } catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchData();
  },[]);

  const generateEnrollment = (students:any[]) => {

    const years:any = {};

    students.forEach((s:any)=>{

      const year = "2025";

      if(!years[year]) years[year]=0;

      years[year]+=1;

    });

    const data = Object.keys(years).map(y=>({
      year:y,
      students:years[y]
    }));

    setEnrollmentData(data);

  };

  const generatePerformance = (marks:any[]) => {

    const dept:any = {};

    marks.forEach((m:any)=>{

      if(!dept[m.course]) dept[m.course]={total:0,count:0};

      dept[m.course].total+=m.marks;
      dept[m.course].count+=1;

    });

    const data = Object.keys(dept).map(d=>({

      dept:`Course ${d}`,
      avgGPA: Number((dept[d].total/dept[d].count/25).toFixed(2))

    }));

    setPerformanceData(data);

  };

  const generatePassRate = (marks:any[]) => {

    const sem:any = {};

    marks.forEach((m:any)=>{

      const semester = `Exam ${m.exam_type}`;

      if(!sem[semester]) sem[semester]={pass:0,total:0};

      sem[semester].total+=1;

      if(m.marks>=40) sem[semester].pass+=1;

    });

    const data = Object.keys(sem).map(s=>({

      semester:s,
      rate:Math.round((sem[s].pass/sem[s].total)*100)

    }));

    setPassRate(data);

  };

  const totalEnrollment = students.length;

  const avgGPA = marks.length
    ? (marks.reduce((a,b)=>a+b.marks,0)/marks.length/25).toFixed(2)
    : 0;

  const pass = marks.filter((m:any)=>m.marks>=40).length;
  const passRateTotal = marks.length ? Math.round(pass/marks.length*100) : 0;

  return (

    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Reports & Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        {[
          { label:"Total Enrollment",value:totalEnrollment },
          { label:"Avg GPA",value:avgGPA },
          { label:"Pass Rate",value:`${passRateTotal}%` },
          { label:"Graduation Rate",value:"—" }
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Enrollment Trend
          </h2>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={enrollmentData}>

              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>

              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12}/>

              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>

              <Tooltip/>

              <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4,4,0,0]}/>

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Pass Rate by Semester
          </h2>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={passRate}>

              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>

              <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" fontSize={12}/>

              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>

              <Tooltip/>

              <Line type="monotone" dataKey="rate" stroke="hsl(var(--success))" strokeWidth={2}/>

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Department-wise Average GPA
        </h2>

        <ResponsiveContainer width="100%" height={250}>

          <BarChart data={performanceData}>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>

            <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={12}/>

            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0,4]}/>

            <Tooltip/>

            <Bar dataKey="avgGPA" fill="hsl(var(--primary))" radius={[4,4,0,0]}/>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </AdminDashboardLayout>

  );

};

export default AdminReports;