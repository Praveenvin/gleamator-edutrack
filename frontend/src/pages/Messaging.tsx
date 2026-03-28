import { DashboardLayout } from "@/components/DashboardLayout"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Search, Clock, X } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const [search, setSearch] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
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
  const confirmDelete = async (id: number) => {
  try {
    setError("");
    setSuccess("");

    await axios.delete(`http://127.0.0.1:8000/api/messages/${id}/`);

    setMessages(prev => prev.filter(m => m.id !== id));
    setSelectedMessage(prev => (prev?.id === id ? null : prev));

    setSuccess("Message deleted successfully");

  } catch (err) {
    console.error(err);
    setError("Failed to delete message");
  }
};
  const suggestions = messages
  .filter(m =>
    (m.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.sender_name || "").toLowerCase().includes(search.toLowerCase())
  )
  .slice(0, 5)
  const saveSearch = (value: string) => {
  if (!value.trim()) return

  let updated = [value, ...searchHistory.filter(v => v !== value)]
  updated = updated.slice(0, 5)

  setSearchHistory(updated)
  localStorage.setItem("student_message_search_history", JSON.stringify(updated))
}
  const updateMessage = async (msg: Message) => {
  try {
    await axios.put(
      `http://127.0.0.1:8000/api/messages/${msg.id}/`,
      {
        subject: msg.subject,
        message: msg.body
      }
    );

    // ✅ update locally
    setMessages(prev =>
      prev.map(m =>
        m.id === msg.id ? msg : m
      )
    );

  } catch (err) {
    console.error(err);
  }
};
  const filteredMessages = messages.filter(m =>
  m.subject.toLowerCase().includes(search.toLowerCase()) ||
  m.body.toLowerCase().includes(search.toLowerCase()) ||
  m.sender_name.toLowerCase().includes(search.toLowerCase())
)
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
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
const uniqueFaculty = Array.from(
  new Map<number, Faculty>(
    facultyRes.data
      .filter((f: Faculty) => facultyIds.includes(Number(f.id)))
      .map((f: Faculty) => [f.id, f])
  ).values()
)

setFaculty(uniqueFaculty)

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
const unique = Array.from(
  new Map<string, Message>(
    filtered.map((m: Message) => [
      m.subject + m.body + m.sender,
      m
    ])
  ).values()
)

setMessages(unique)

if (unique.length > 0) {
  setSelectedMessage(unique[0] || null)
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
  setCurrentPage(1)
}, [search])

  useEffect(() => {
  const stored = localStorage.getItem("student_message_search_history")
  if (stored) setSearchHistory(JSON.parse(stored))
}, [])
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])

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

  await axios.post("http://127.0.0.1:8000/api/messages/", {
    sender: user?.id,
    receiver: fac.email,
    subject,
    message: body
  })
}

      setSuccess("Message sent successfully")

      setSubject("")
      setBody("")
      setSelectedFaculty([])

      const newMsg = {
  id: Date.now(),
  sender: user?.id,
  receiver: 0,
  subject,
  body,
  created_at: new Date().toISOString(),
  sender_name: "You",
  receiver_name: "",
  course_names: []
};

setMessages(prev => [newMsg, ...prev]);
setSelectedMessage(newMsg);

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT PANEL */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">

  {/* 🔍 SEARCH */}
  <div className="p-3 border-b border-border bg-muted/30">
    <div ref={searchRef} className="relative">

      <input
        placeholder="Search messages..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setShowDropdown(true)
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!search.trim()) return
            saveSearch(search)
            setShowDropdown(false)
          }
        }}
        className="w-full px-3 py-2 rounded-md 
bg-background border border-border 
hover:border-primary/40 
focus:outline-none focus:ring-2 focus:ring-primary/20
transition"
      />

      {showDropdown && (
  <div className="absolute w-full bg-white border border-border rounded-xl shadow-lg mt-2 z-50 max-h-64 overflow-y-auto">

    {/* 🔁 HISTORY */}
    {!search && searchHistory.length > 0 && (
      <div className="py-1">

        <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground">
          <span>Recent Searches</span>
          <button
            onClick={() => {
              localStorage.removeItem("student_message_search_history")
              setSearchHistory([])
            }}
            className="hover:text-red-500"
          >
            Clear
          </button>
        </div>

        {searchHistory.map((item, i) => (
          <div
            key={i}
            className="flex justify-between px-3 py-2 hover:bg-muted/50 group"
          >

            {/* LEFT */}
            <div
              onClick={() => {
                setSearch(item)
                saveSearch(item)
                setShowDropdown(false)
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Clock size={14} />
              {item}
            </div>

            {/* DELETE */}
            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation()
                const updated = searchHistory.filter((_, idx) => idx !== i)
                setSearchHistory(updated)
                localStorage.setItem(
                  "student_message_search_history",
                  JSON.stringify(updated)
                )
              }}
              className="opacity-0 group-hover:opacity-100 cursor-pointer transition hover:text-red-500"
            />

          </div>
        ))}
      </div>
    )}

    {/* 🔍 SUGGESTIONS */}
    {search && suggestions.map((m, i) => (
      <div
        key={i}
        onClick={() => {
          setSearch(m.subject)
          saveSearch(m.subject)
          setShowDropdown(false)
        }}
        className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 cursor-pointer"
      >
        <Search size={14} />
        {m.subject}
      </div>
    ))}

  </div>
)}

    </div>
  </div>

  {/* 📩 MESSAGE LIST */}
  <div className="max-h-[500px] overflow-y-auto space-y-1 p-1">

    {currentMessages.map((m) => {

      const isMine = m.sender === user?.id

      return (
        <button
          key={m.id}
          onClick={() => setSelectedMessage(m)}
          className={`group w-full text-left px-4 py-3 
          transition-all duration-200 ease-in-out rounded-lg
          ${selectedMessage?.id === m.id 
            ? "bg-primary/15 shadow-sm" 
            : "hover:bg-muted/40 hover:scale-[1.01]"}`}
        >

          <div className="flex justify-between items-center mb-1">

            <p className="text-sm font-medium text-foreground leading-tight">
              {m.subject}
            </p>

            <div className="flex items-center gap-2">

              <span className="text-xs text-muted-foreground">
                {isMine ? "You" : m.sender_name}
              </span>

              {isMine && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedMessage(m)
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      confirmDelete(m.id)
                    }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>
              )}

            </div>
          </div>

          {/* COURSES */}
          <div className="flex flex-wrap gap-1 mt-1">
            {m.course_names?.map((c, i) => (
              <span
                key={i}
                className={`px-2 py-[2px] text-[10px] rounded-full border ${getColor(c)}`}
              >
                {c}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {m.body}
          </p>

        </button>
      )
    })}

    {/* 🔢 PAGINATION */}
    {filteredMessages.length > messagesPerPage && (
      <div className="flex justify-between items-center mt-4 px-3 py-3 border-t border-border">

        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">

          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium 
            flex items-center gap-1 border transition-all duration-200

            ${currentPage === 1
              ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
              : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md"
            }`}
          >
            ← Prev
          </button>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium 
            flex items-center gap-1 border transition-all duration-200

            ${currentPage === totalPages
              ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
              : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md"
            }`}
          >
            Next →
          </button>

        </div>

      </div>
    )}

  </div>

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
                <div className="flex justify-between items-start mb-3 border-b border-border pb-2">

  <div>
    <h3 className="font-semibold text-lg">
      {selectedMessage.subject}
    </h3>

    <span className="text-xs text-muted-foreground">
      {new Date(selectedMessage.created_at).toLocaleString()}
    </span>
  </div>

  {/* ✅ ACTIONS */}
  {selectedMessage.sender === user?.id && (
    <div className="flex gap-2">

      <button
        onClick={() => updateMessage(selectedMessage)}
        className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={() => confirmDelete(selectedMessage.id)}
        className="p-1.5 rounded text-red-600 hover:bg-red-100 transition"
      >
        <Trash2 size={16} />
      </button>

    </div>
  )}

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