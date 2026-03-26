import { DashboardLayout } from "@/components/DashboardLayout"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"

interface Faculty {
  id: number
  name: string
}

interface LeaveRequest {
  id: number
  from_date: string
  to_date: string
  reason: string
  status: string
}

const statusStyle: Record<string, string> = {
  Approved: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
}

const LeaveRequests = () => {

  const { user } = useAuth()

  const [studentId, setStudentId] = useState<number | null>(null)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const today = new Date().toISOString().split("T")[0]
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
    faculty: ""
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // ================= GET STUDENT =================
  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/student-profile/?username=${user?.username}`
      )
      setStudentId(res.data.id)
    } catch (err) {
      console.error(err)
    }
  }

  // ================= FETCH FACULTY (FILTERED) =================
  const fetchFaculties = async (sid: number) => {
    try {

      const enrollRes = await axios.get(
        `http://127.0.0.1:8000/api/enrollments/?student=${sid}`
      )

      const courseIds = enrollRes.data.map((e: any) => Number(e.course))

      const courseRes = await axios.get(
        "http://127.0.0.1:8000/api/courses/"
      )

      const myCourses = courseRes.data.filter((c: any) =>
        courseIds.includes(Number(c.id))
      )

      const facultyIds = [
        ...new Set(
          myCourses.map((c: any) => Number(c.faculty)).filter(Boolean)
        )
      ]

      const facultyRes = await axios.get(
        "http://127.0.0.1:8000/api/faculty/"
      )

      const myFaculty = facultyRes.data.filter((f: any) =>
        facultyIds.includes(Number(f.id))
      )

      setFaculties(myFaculty)

    } catch (err) {
      console.error(err)
    }
  }

  // ================= FETCH REQUESTS =================
  const fetchRequests = async (sid: number) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/leave-requests/?role=student&user=${sid}`
      )
      setRequests(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // ================= INIT =================
  useEffect(() => {
    if (user?.username) fetchStudent()
  }, [user])

  useEffect(() => {
    if (studentId) {
      fetchFaculties(studentId)
      fetchRequests(studentId)
    }
  }, [studentId])

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    setError("")
    setSuccess("")

    if (!form.from_date || !form.to_date || !form.reason || !form.faculty) {
      setError("All fields required")
      return
    }

    if (form.from_date > form.to_date) {
      setError("Invalid date range")
      return
    }

    try {

      setLoading(true)

      await axios.post(
        "http://127.0.0.1:8000/api/leave-requests/",
        {
          student: studentId,   // ✅ FIXED
          faculty: form.faculty,
          from_date: form.from_date,
          to_date: form.to_date,
          reason: form.reason,
          is_faculty_leave: false
        }
      )

      setSuccess("Leave request submitted successfully")

      setForm({
        from_date: "",
        to_date: "",
        reason: "",
        faculty: ""
      })

      fetchRequests(studentId!)

    } catch (err) {
      console.error(err)
      setError("Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-medium mb-6">
        Leave Requests
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* APPLY */}
        <div className="bg-card border border-border rounded-xl p-6">

          <h2 className="mb-4 font-medium">Apply for Leave</h2>

          {success && (
  <div className="mb-3 px-3 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200 flex justify-between items-center text-sm">
    
    <span>{success}</span>

    <button
      onClick={() => setSuccess("")}
      className="ml-3 text-green-700 hover:text-green-900 text-xs font-bold transition"
    >
      ✕
    </button>

  </div>
)}

          {error && (
  <div className="mb-3 px-3 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200 flex justify-between items-center text-sm">
    
    <span>{error}</span>

    <button
      onClick={() => setError("")}
      className="ml-3 text-red-700 hover:text-red-900 text-xs font-bold transition"
    >
      ✕
    </button>

  </div>
)}

          <div className="space-y-4">

            <select
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm 
focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <input
  type="date"
  min={today}   // ✅ ADD THIS
  value={form.from_date}
  onChange={(e) => setForm({ ...form, from_date: e.target.value })}
  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm 
focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
/>

            <input
  type="date"
  min={form.from_date || today}   // ✅ IMPORTANT (no past + no before from_date)
  value={form.to_date}
  onChange={(e) => setForm({ ...form, to_date: e.target.value })}
  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm 
focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
/>

            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm 
focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-10 bg-primary text-white rounded"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </div>

        </div>

        {/* HISTORY */}
        <div className="bg-card border border-border rounded-xl p-6">

          <h2 className="mb-4 font-medium">Previous Requests</h2>

          {requests.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No leave requests yet
            </p>
          )}

          <div className="space-y-3">

            {requests.map(r => (
              <div key={r.id} className="flex justify-between items-center border-b pb-3">

                <div>
                  <p>{r.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.from_date} → {r.to_date}
                  </p>
                </div>

                <span className={`px-2 py-1 text-xs rounded-full border ${statusStyle[r.status]}`}>
                  {r.status}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default LeaveRequests