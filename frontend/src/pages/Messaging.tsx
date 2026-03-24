import { DashboardLayout } from "@/components/DashboardLayout"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"

interface Faculty {
  id: number
  name: string
  email: string
}

interface Message {
  id: number
  sender: number
  receiver: number
  subject: string
  body: string
  created_at: string

  // ✅ NEW
  sender_name: string
  receiver_name: string
  course_names: string[]
}

const Messaging = () => {

  const { user } = useAuth()
  const courseColors = [
  
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];
  const [studentId, setStudentId] = useState<number | null>(null)
  const [studentUserId, setStudentUserId] = useState<number | null>(null)
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const [selectedFaculty, setSelectedFaculty] = useState<number[]>([])

  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const getColor = (name: string) => {
  let hash = 0

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return courseColors[Math.abs(hash) % courseColors.length]
}
  // ================= GET STUDENT =================
  const fetchStudentProfile = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/student-profile/?username=${user?.username}`
      )
      setStudentId(res.data.id)
      setStudentUserId(res.data.user_id)   // 🔥 ADD THIS
    } catch (err) {
      console.error("Student profile error:", err)
    }
  }

  // ================= FETCH FACULTY =================
  const fetchFaculty = async () => {
    try {

      const enrollRes = await axios.get(
        `http://127.0.0.1:8000/api/enrollments/?student=${studentId}`
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

      setFaculty(myFaculty)

    } catch (err) {
      console.error("Faculty fetch error:", err)
    }
  }

  // ================= FETCH MESSAGES =================
 const fetchMessages = async () => {
  try {

    if (!studentUserId) return

    const res = await axios.get(
      "http://127.0.0.1:8000/api/messages/",
      {
        params: { user: studentUserId }
      }
    )

    const filtered = res.data.filter(
      (m: Message) =>
        m.sender === studentUserId || m.receiver === studentUserId
    )

    setMessages(filtered)

    if (filtered.length > 0) {
      setSelectedMessage(filtered[0])
    }

  } catch (err) {
    console.error("Message fetch error:", err)
  }
}
  // ================= EFFECTS =================
  useEffect(() => {
    if (user?.username) {
      fetchStudentProfile()
    }
  }, [user])

  useEffect(() => {
  if (studentId) {
    fetchFaculty()
  }
}, [studentId])

  useEffect(() => {
  if (studentUserId) {
    fetchMessages()
  }
}, [studentUserId])

  // ================= TOGGLE =================
  const toggleFaculty = (id: number) => {
    setSelectedFaculty(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // ================= SEND =================
  const sendMessage = async () => {

    setError("")
    setSuccess("")

    if (!subject.trim() || !body.trim()) {
      setError("Subject and message required")
      return
    }

    if (selectedFaculty.length === 0) {
      setError("Select at least one faculty")
      return
    }

    try {

      setLoading(true)

      for (let fId of selectedFaculty) {

        const fac = faculty.find(f => f.id === fId)
        if (!fac) continue

        await axios.post(
          "http://127.0.0.1:8000/api/messages/",
          {
            sender: user?.id,
            receiver: fac.email,
            subject,
            message: body
          }
        )
      }

      setSuccess("Message sent successfully")

      setSubject("")
      setBody("")
      setSelectedFaculty([])

      fetchMessages()

    } catch (err) {
      console.error(err)
      setError("Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (

    <DashboardLayout>

      <h1 className="text-2xl font-medium mb-6">
        Messaging
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* LEFT PANEL */}
        <div className="bg-card border border-border rounded-2xl overflow-auto 
shadow-sm hover:shadow-md transition-all duration-200">

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
  <p className="text-sm">No messages yet</p>
  <span className="text-xs">Start a conversation 🚀</span>
</div>
          )}

          {messages.map((m) => {

            const isMine = m.sender === user?.id

            return (
              <button
                key={m.id}
                onClick={() => setSelectedMessage(m)}
                className={`w-full text-left px-4 py-3 
transition-all duration-200 ease-in-out rounded-lg
${selectedMessage?.id === m.id 
  ? "bg-primary/15 shadow-sm" 
  : "hover:bg-muted/40 hover:scale-[1.01]"}
`}
              >

                <div className="flex justify-between items-center mb-1">

                 <p className="text-sm font-medium text-foreground leading-tight">
                    {m.subject}
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {isMine ? "You" : m.sender_name}
                  </span>

                </div>

                {/* ✅ COURSE */}
                <div className="flex flex-wrap gap-1 mt-1">
  {m.course_names?.map((c, i) => (
    <span
      key={i}
      className={`px-2 py-[2px] text-[10px] rounded-full border ${
  getColor(c)
}`}
    >
      {c}
    </span>
  ))}
</div>

                <p className="text-xs text-muted-foreground truncate leading-relaxed">
                  {m.body}
                </p>

              </button>
            )
          })}

        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* SEND */}
          <div className="bg-card border border-border rounded-2xl p-5 
shadow-sm hover:shadow-md transition-all duration-200">

            <h2 className="font-semibold mb-2">
              Send Message to Faculty
            </h2>

            {success && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200 flex justify-between items-center text-sm">
                {success}
                <button onClick={() => setSuccess("")}>✕</button>
              </div>
            )}

            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200 text-sm">
                {error}
              </div>
            )}

            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
             className="w-full mb-3 px-3 py-2.5 rounded-lg text-sm 
bg-background border border-border 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            />

            <textarea
              placeholder="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
             className="w-full mb-3 px-3 py-2.5 rounded-lg text-sm 
bg-background border border-border 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20 
transition"
            />

            {/* FACULTY SELECT */}
            <div className="mb-3 border border-border rounded-xl p-3 
bg-muted/20 hover:bg-muted/30 transition">

              <p className="text-xs mb-2 text-muted-foreground font-medium">
                Select Faculty
              </p>

              <div className="flex flex-wrap gap-2">
                {faculty.map(f => (
                  <span
                    key={f.id}
                    onClick={() => toggleFaculty(f.id)}
                    className={`px-3 py-1 text-xs rounded-full border cursor-pointer 
transition-all duration-200 flex items-center gap-1
${selectedFaculty.includes(f.id)
 ? "bg-primary text-white border-primary shadow-sm scale-105 ring-2 ring-primary/30"
  : "bg-muted/30 hover:bg-muted/60 hover:scale-105"}
`}
                  >
                    {f.name}
                  </span>
                ))}
              </div>

            </div>

            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium
bg-primary text-white 
hover:bg-primary/90 
transition-all duration-200 
shadow-sm hover:shadow-md 
active:scale-95"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </div>

          {/* VIEW */}
          <div className="bg-card border border-border rounded-2xl p-6 flex-1 
shadow-sm hover:shadow-md transition-all duration-200">

            {selectedMessage ? (

              <>
                <div className="flex justify-between items-center mb-3 border-b border-border pb-2">

                  <h3 className="font-semibold text-lg">
                    {selectedMessage.subject}
                  </h3>

                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>

                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  {selectedMessage.sender === user?.id
                    ? "You"
                    : selectedMessage.sender_name}
                </p>

                {/* ✅ COURSE BADGES */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedMessage.course_names?.map((c, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 text-xs rounded-full border ${
  getColor(c)
}`}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="bg-muted/40 p-4 rounded-xl border border-border text-sm leading-relaxed shadow-inner">
  {selectedMessage.body}
</div>

              </>

            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
  <p className="text-sm">No message selected</p>
  <span className="text-xs">Choose a conversation 👈</span>
</div>
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default Messaging