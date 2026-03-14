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

interface Mark {
  student: number
  course: number
  marks: number
  exam_type: string
}

const STUDENTS_API = "http://127.0.0.1:8000/api/students/"
const COURSES_API = "http://127.0.0.1:8000/api/courses/"
const MARKS_API = "http://127.0.0.1:8000/api/marks/"

const FacultyMarks = () => {

  const [students,setStudents] = useState<Student[]>([])
  const [courses,setCourses] = useState<Course[]>([])
  const [selectedCourse,setSelectedCourse] = useState<number | null>(null)

  const [marks,setMarks] = useState<Record<number,{test1:number,test2:number,test3:number}>>({})

  const fetchStudents = async () => {

    const res = await axios.get(STUDENTS_API)
    setStudents(res.data)

    const initial:any = {}

    res.data.forEach((s:Student)=>{
      initial[s.id] = {test1:0,test2:0,test3:0}
    })

    setMarks(initial)

  }

  const fetchCourses = async () => {

    const res = await axios.get(COURSES_API)
    setCourses(res.data)

    if(res.data.length>0){
      setSelectedCourse(res.data[0].id)
    }

  }

  useEffect(()=>{
    fetchStudents()
    fetchCourses()
  },[])

  const updateMark = (studentId:number,test:string,value:number) => {

    setMarks({
      ...marks,
      [studentId]:{
        ...marks[studentId],
        [test]:value
      }
    })

  }

  const submitMarks = async () => {

    try{

      for(const studentId in marks){

        const m = marks[studentId]

        await axios.post(MARKS_API,{
          student:studentId,
          course:selectedCourse,
          marks:m.test1,
          exam_type:"Test1"
        })

        await axios.post(MARKS_API,{
          student:studentId,
          course:selectedCourse,
          marks:m.test2,
          exam_type:"Test2"
        })

        await axios.post(MARKS_API,{
          student:studentId,
          course:selectedCourse,
          marks:m.test3,
          exam_type:"Test3"
        })

      }

      alert("Marks saved successfully")

    }
    catch(err){
      console.error(err)
      alert("Error saving marks")
    }

  }

  return (

    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Internal Marks
      </h1>

      <div className="flex items-center gap-4 mb-6">

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

        <button
          onClick={submitMarks}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Save Marks
        </button>

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

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
                Test 1 (50)
              </th>

              <th className="text-left py-2 text-muted-foreground font-medium">
                Test 2 (50)
              </th>

              <th className="text-left py-2 text-muted-foreground font-medium">
                Test 3 (50)
              </th>

              <th className="text-left py-2 text-muted-foreground font-medium">
                Total (150)
              </th>

            </tr>

          </thead>

          <tbody>

            {students.map(s=>{

              const m = marks[s.id] || {test1:0,test2:0,test3:0}

              const total = m.test1 + m.test2 + m.test3

              return(

                <tr key={s.id} className="border-b border-border last:border-0">

                  <td className="py-2.5 font-mono text-primary text-xs">
                    {s.id}
                  </td>

                  <td className="py-2.5 text-foreground">
                    {s.name}
                  </td>

                  <td>
                    <input
                      type="number"
                      value={m.test1}
                      onChange={(e)=>updateMark(s.id,"test1",Number(e.target.value))}
                      className="w-16 border rounded px-1"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={m.test2}
                      onChange={(e)=>updateMark(s.id,"test2",Number(e.target.value))}
                      className="w-16 border rounded px-1"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={m.test3}
                      onChange={(e)=>updateMark(s.id,"test3",Number(e.target.value))}
                      className="w-16 border rounded px-1"
                    />
                  </td>

                  <td className="py-2.5 font-medium text-foreground">
                    {total}/150
                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

    </FacultyDashboardLayout>

  )

}

export default FacultyMarks