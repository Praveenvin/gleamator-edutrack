import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Assignment {
  id: number
  title: string
  subject: string
  due: string
  status: string
  file?: string | null
  submitted_at?: string | null
}

const statusStyle: Record<string,string> = {
  Submitted: "text-green-600 bg-green-100",
  Pending: "text-yellow-600 bg-yellow-100",
  Late: "text-red-600 bg-red-100"
}

const STUDENT_ID = 103

const Assignments = () => {

  const [assignments,setAssignments] = useState<Assignment[]>([])
  const [uploading,setUploading] = useState<number | null>(null)

  useEffect(()=>{
    fetchAssignments()
  },[])

  const fetchAssignments = async () => {

    const res = await axios.get(
      `http://127.0.0.1:8000/api/assignments/?student=${STUDENT_ID}`
    )

    const formatted = res.data.map((a:any)=>({

      id: a.id,
      title: a.title,
      subject: a.course,
      due: a.due_date,
      status: a.status,
      file: a.file,
      submitted_at: a.submitted_at

    }))

    setAssignments(formatted)
  }

  const submitAssignment = async (assignmentId:number,file:File) => {

    const formData = new FormData()

    formData.append("student",STUDENT_ID.toString())
    formData.append("assignment",assignmentId.toString())
    formData.append("file",file)
    formData.append("status","Submitted")

    try{

      setUploading(assignmentId)

      await axios.post(
        "http://127.0.0.1:8000/api/submit-assignment/",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      )

      fetchAssignments()

    }
    catch(err){
      console.error(err)
    }
    finally{
      setUploading(null)
    }

  }

  const isDeadlinePassed = (due:string) => {

    const today = new Date()
    const dueDate = new Date(due)

    return today > dueDate
  }

  return (

  <DashboardLayout>

    <h1 className="text-2xl font-medium mb-6">
      Assignments
    </h1>

    <div className="bg-card rounded-lg border overflow-hidden">

      <table className="w-full text-sm">

        <thead>
          <tr className="border-b bg-secondary/50">

            <th className="px-6 py-3 text-left">Title</th>
            <th className="px-6 py-3 text-left">Subject</th>
            <th className="px-6 py-3 text-left">Due</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Submission</th>

          </tr>
        </thead>

        <tbody>

          {assignments.map((a)=>{

            const late = isDeadlinePassed(a.due)

            return (

            <tr key={a.id}
            className="border-b hover:bg-secondary/30">

              <td className="px-6 py-4">{a.title}</td>

              <td className="px-6 py-4 text-muted-foreground">
                {a.subject}
              </td>

              <td className="px-6 py-4">
                {a.due}
              </td>

              <td className="px-6 py-4">

                <span
                className={`text-xs px-2 py-1 rounded-full ${statusStyle[a.status]}`}>
                  {late && a.status !== "Submitted" ? "Late" : a.status}
                </span>

              </td>

              <td className="px-6 py-4">

                {/* If submitted */}

                {a.file ? (

                  <div className="flex gap-3 items-center">

                    <a
                    href={`http://127.0.0.1:8000${a.file}`}
                    target="_blank"
                    className="text-blue-600 text-xs underline"
                    >
                      View
                    </a>

                    {/* Allow resubmit only before deadline */}

                    {!late && (

                      <label className="cursor-pointer text-orange-600 text-xs">

                        Edit

                        <input
                        type="file"
                        className="hidden"
                        onChange={(e)=>{
                          if(e.target.files){
                            submitAssignment(a.id,e.target.files[0])
                          }
                        }}
                        />

                      </label>

                    )}

                  </div>

                )

                /* If not submitted */

                : late ? (

                  <span className="text-red-600 text-xs">
                    Deadline Passed
                  </span>

                ) : (

                  <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="text-xs"
                  disabled={uploading === a.id}
                  onChange={(e)=>{

                    if(e.target.files){

                      submitAssignment(a.id,e.target.files[0])

                    }

                  }}
                  />

                )}

              </td>

            </tr>

            )

          })}

        </tbody>

      </table>

    </div>

  </DashboardLayout>
  )
}

export default Assignments