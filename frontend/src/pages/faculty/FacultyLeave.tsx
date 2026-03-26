import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"

interface Leave {
  id: number
  student_name: string
  usn: string
  subject: string
  from_date: string
  to_date: string
  reason: string
  status: string
}

const statusStyle: Record<string, string> = {
  Approved: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
  Rejected: "text-destructive bg-destructive/10",
}

const FacultyLeave = () => {

  const { user } = useAuth()

  const [tab, setTab] = useState<"requests" | "apply">("requests")
  const [facultyId, setFacultyId] = useState<number | null>(null)

  const [leaves, setLeaves] = useState<Leave[]>([])
  const [myLeaves, setMyLeaves] = useState<Leave[]>([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: ""
  })

  const today = new Date().toISOString().split("T")[0]

  // ================= FETCH FACULTY =================
  const fetchFaculty = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/current-faculty/?username=${user?.username}`
      )
      setFacultyId(res.data.id)
    } catch (err) {
      console.error(err)
    }
  }

  // ================= FETCH STUDENT REQUESTS =================
  const fetchLeaves = async (fid: number) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/leave-requests/?role=faculty&user=${fid}`
      )
      setLeaves(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // ================= FETCH OWN LEAVES =================
  const fetchMyLeaves = async (uid: number) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/leave-requests/?role=faculty-self&user=${uid}`
    )
    setMyLeaves(res.data)
  } catch (err) {
    console.error(err)
  }
}

  useEffect(() => {
    if (user?.username) fetchFaculty()
  }, [user])

  useEffect(() => {
    if (facultyId) {
      fetchLeaves(facultyId)
      fetchMyLeaves(user?.id)
    }
  }, [facultyId])

  // ================= APPROVE / REJECT =================
  const updateStatus = async (id: number, status: string) => {

    setSuccess("")
    setError("")

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/update-leave-status/${id}/`,
        { status }
      )

      setSuccess(`Request ${status}`)
      fetchLeaves(facultyId!)

    } catch {
      setError("Action failed")
    }
  }

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    setError("")
    setSuccess("")

    if (!form.from_date || !form.to_date || !form.reason) {
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
          from_date: form.from_date,
          to_date: form.to_date,
          reason: form.reason,
          is_faculty_leave: true,
          user: user?.id,                
        }
      )

      setSuccess("Leave request sent to admin")

      setForm({
        from_date: "",
        to_date: "",
        reason: ""
      })

      fetchMyLeaves(user?.id!) 

    } catch {
      setError("Failed to submit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-medium mb-6">
        Leave Management
      </h1>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("requests")}
          className={`px-4 py-2 rounded-md text-sm ${
            tab === "requests"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/60"
          }`}
        >
          Student Requests
        </button>

        <button
          onClick={() => setTab("apply")}
          className={`px-4 py-2 rounded-md text-sm ${
            tab === "apply"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/60"
          }`}
        >
          Apply Leave
        </button>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200 flex justify-between items-center text-sm">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>✕</button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200 flex justify-between items-center text-sm">
          <span>{error}</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* ================= STUDENT REQUESTS ================= */}
      {tab === "requests" && (

        <div className="bg-card rounded-lg border border-border p-6">

          {leaves.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No requests
            </p>
          )}

          <div className="space-y-3">

            {leaves.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-border">

                <div>
                  <p className="text-sm font-medium">{l.student_name}</p>
                  <p className="text-xs text-muted-foreground">{l.usn}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.from_date} → {l.to_date}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyle[l.status]}`}>
                    {l.status}
                  </span>

                  {l.status === "Pending" && (
                    <div className="flex gap-2">

                      <button
                        onClick={() => updateStatus(l.id, "Approved")}
                        className="h-8 px-4 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(l.id, "Rejected")}
                        className="h-8 px-4 text-xs rounded-md border border-destructive text-destructive hover:bg-destructive/10"
                      >
                        Reject
                      </button>

                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* ================= APPLY (MATCH STUDENT UI) ================= */}
      {tab === "apply" && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="bg-card rounded-lg border border-border p-6">

            <h2 className="text-base font-medium mb-4">
              Apply Leave
            </h2>

            <div className="space-y-4">

              <input
                type="date"
                min={today}
                value={form.from_date}
                onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/30"
              />

              <input
                type="date"
                min={form.from_date || today}
                value={form.to_date}
                onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/30"
              />

              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-card rounded-lg border border-border p-6">

            <h2 className="text-base font-medium mb-4">
              My Requests
            </h2>

            {myLeaves.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No leave requests yet
              </p>
            )}

            <div className="space-y-3">

              {myLeaves.map(r => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-3 border-b border-border"
                >

                  <div>
                    <p className="text-sm">{r.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.from_date} → {r.to_date}
                    </p>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </FacultyDashboardLayout>
  )
}

export default FacultyLeave