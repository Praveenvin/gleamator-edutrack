import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  id: number
  course_name: string
  course_code: string
  semester: number
  department: string
}

const COURSES_API = "http://127.0.0.1:8000/api/courses/"
const STUDENTS_API = "http://127.0.0.1:8000/api/students/"

const FacultyCourses = () => {

  const [courses,setCourses] = useState<Course[]>([])
  const [studentCount,setStudentCount] = useState(0)

  const fetchCourses = async () => {

    try{

      const res = await axios.get(COURSES_API)
      setCourses(res.data)

    }
    catch(err){
      console.error(err)
    }

  }

  const fetchStudents = async () => {

    try{

      const res = await axios.get(STUDENTS_API)
      setStudentCount(res.data.length)

    }
    catch(err){
      console.error(err)
    }

  }

  useEffect(()=>{
    fetchCourses()
    fetchStudents()
  },[])

  return (

    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        My Courses
      </h1>

      {/* COURSE CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {courses.map(c => (

          <div
            key={c.id}
            className="bg-card rounded-lg border border-border p-6"
          >

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                {c.course_code}
              </span>

              <span className="text-xs text-muted-foreground">
                {c.semester} Sem
              </span>

            </div>

            <h3 className="text-lg font-semibold text-foreground">
              {c.course_name}
            </h3>

            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">

              <p className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                {studentCount} students
              </p>

              <p>Department: {c.department}</p>

              <p>Room: —</p>

            </div>

          </div>

        ))}

      </div>

      {/* COURSE TABLE */}

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Course Schedule Overview
        </h2>

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-border">

              {["Code","Course","Department","Semester","Students"].map(h => (

                <th
                  key={h}
                  className="text-left py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {courses.map(c => (

              <tr
                key={c.id}
                className="border-b border-border last:border-0"
              >

                <td className="py-2.5 font-mono text-primary text-xs">
                  {c.course_code}
                </td>

                <td className="py-2.5 text-foreground">
                  {c.course_name}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {c.department}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {c.semester}
                </td>

                <td className="py-2.5 text-foreground">
                  {studentCount}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </FacultyDashboardLayout>

  )

}

export default FacultyCourses