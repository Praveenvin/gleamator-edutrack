import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  id: number
  name: string
}

interface Course {
  id: number
  course_name: string
  course_code: string
}

const STUDENTS_API = "http://127.0.0.1:8000/api/students/"
const COURSES_API = "http://127.0.0.1:8000/api/courses/"
const ATTENDANCE_API = "http://127.0.0.1:8000/api/attendance/"

const FacultyAttendance = () => {

  const [students,setStudents] = useState<Student[]>([])
  const [courses,setCourses] = useState<Course[]>([])
  const [selectedCourse,setSelectedCourse] = useState<number | null>(null)
  const [date,setDate] = useState(new Date().toISOString().slice(0,10))

  const [attendance,setAttendance] = useState<Record<number,string>>({})

  // Fetch students
  const fetchStudents = async () => {
    const res = await axios.get(STUDENTS_API)
    setStudents(res.data)

    const initial: Record<number,string> = {}
    res.data.forEach((s:Student)=>{
      initial[s.id] = "Present"
    })

    setAttendance(initial)
  }

  // Fetch courses
  const fetchCourses = async () => {
    const res = await axios.get(COURSES_API)
    setCourses(res.data)

    if(res.data.length > 0){
      setSelectedCourse(res.data[0].id)
    }
  }

  useEffect(()=>{
    fetchStudents()
    fetchCourses()
  },[])

  const toggleStatus = (id:number) => {

    setAttendance({
      ...attendance,
      [id]: attendance[id] === "Present" ? "Absent" : "Present"
    })

  }

  const submitAttendance = async () => {

    try{

      for(const studentId in attendance){

        await axios.post(ATTENDANCE_API,{
          student: studentId,
          course: selectedCourse,
          date: date,
          status: attendance[Number(studentId)]
        })

      }

      alert("Attendance submitted successfully")

    }
    catch(err){
      console.error(err)
      alert("Error submitting attendance")
    }

  }

  const presentCount = Object.values(attendance).filter(s=>s==="Present").length
  const percentage = students.length ? Math.round((presentCount/students.length)*100) : 0

  return (

    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Attendance
      </h1>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Today's Classes</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {courses.length}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Avg Attendance</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {percentage}%
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Low Attendance Students</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {students.length - presentCount}
          </p>
        </div>

      </div>

      {/* ATTENDANCE TABLE */}

      <div className="bg-card rounded-lg border border-border p-6">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold text-foreground">
            Mark Attendance
          </h2>

          <div className="flex items-center gap-3">

            <select
              value={selectedCourse ?? ""}
              onChange={(e)=>setSelectedCourse(Number(e.target.value))}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            >

              {courses.map(c=>(
                <option key={c.id} value={c.id}>
                  {c.course_code} - {c.course_name}
                </option>
              ))}

            </select>

            <input
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            />

          </div>

        </div>

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-border">

              <th className="text-left py-2 text-muted-foreground font-medium">
                ID
              </th>

              <th className="text-left py-2 text-muted-foreground font-medium">
                Student Name
              </th>

              <th className="text-left py-2 text-muted-foreground font-medium">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {students.map(s => (

              <tr key={s.id} className="border-b border-border last:border-0">

                <td className="py-2.5 font-mono text-primary text-xs">
                  {s.id}
                </td>

                <td className="py-2.5 text-foreground">
                  {s.name}
                </td>

                <td className="py-2.5">

                  <button
                    onClick={()=>toggleStatus(s.id)}
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      attendance[s.id] === "Present"
                        ? "text-success bg-success/10"
                        : "text-destructive bg-destructive/10"
                    }`}
                  >
                    {attendance[s.id]}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="mt-4 flex justify-end">

          <button
            onClick={submitAttendance}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Submit Attendance
          </button>

        </div>

      </div>

    </FacultyDashboardLayout>

  )

}

export default FacultyAttendance