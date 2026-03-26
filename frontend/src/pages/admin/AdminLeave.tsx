import { AdminDashboardLayout } from "@/components/AdminDashboardLayout"
import { useEffect, useState } from "react"
import axios from "axios"

interface Leave {
  id: number
  from_date: string
  to_date: string
  reason: string
  status: string
  faculty_name: string
  requester?: number
}

const statusStyle: Record<string, string> = {
  Approved: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
  Rejected: "text-destructive bg-destructive/10",
}

const AdminLeave = () => {

  const [leaves, setLeaves] = useState<Leave[]>([])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // ================= FETCH =================
  const fetchLeaves = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/leave-requests/?role=admin"
    )

    console.log(res.data)   // 👈 ADD THIS

    setLeaves(res.data)
  } catch {
    setError("Failed to load requests")
  }
}

  useEffect(() => {
    fetchLeaves()
  }, [])

  // ================= UPDATE =================
  const updateStatus = async (id: number, status: string) => {

    setSuccess("")
    setError("")

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/update-leave-status/${id}/`,
        { status }
      )

      setSuccess(`Request ${status}`)
      fetchLeaves()

    } catch {
      setError("Action failed")
    }
  }

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-medium mb-6">
        Faculty Leave Requests
      </h1>

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

      <div className="bg-card rounded-lg border border-border p-6">

        {leaves.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No faculty leave requests
          </p>
        )}

        <div className="space-y-3">

          {leaves.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between py-3 border-b border-border"
            >

              {/* LEFT */}
              <div>
                <p className="text-sm font-medium">
                  {r.faculty_name || "Unknown Faculty"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {r.from_date} → {r.to_date}
                </p>

                <p className="text-sm mt-1">
                  {r.reason}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                  {r.status}
                </span>

                {r.status === "Pending" && (
                  <div className="flex gap-2">

                    <button
                      onClick={() => updateStatus(r.id, "Approved")}
                      className="h-8 px-4 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(r.id, "Rejected")}
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

    </AdminDashboardLayout>
  )
}

export default AdminLeave