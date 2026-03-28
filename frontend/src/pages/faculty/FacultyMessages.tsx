import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useState, useEffect ,useRef} from "react";
import axios from "axios";
import { Search, Clock, X } from "lucide-react";
import { Pencil, Trash2, Plus } from "lucide-react";
interface Message {
  id: number;
  sender: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Course {
  id: number;
  course_name: string;
  course_code: string;
}

const API = "http://127.0.0.1:8000/api/messages/";
const COURSE_API = "http://127.0.0.1:8000/api/courses/";
const ENROLL_API = "http://127.0.0.1:8000/api/enrollments/";

const FacultyMessages = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [filtered, setFiltered] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [popupError, setPopupError] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const fetchingRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / messagesPerPage);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Message | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const courseColors = [
  "bg-green-100 text-green-700 border-green-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];

const getColor = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return courseColors[Math.abs(hash * 7) % courseColors.length]
}
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
const [searchHistory, setSearchHistory] = useState<string[]>([])
const [showDropdown, setShowDropdown] = useState(false)
const searchRef = useRef<HTMLDivElement>(null)
  // ================= FETCH =================

  const fetchMessages = async () => {
  if (fetchingRef.current) return;   // 🚫 prevent multiple calls

  fetchingRef.current = true;

  try {
    const facultyId = Number(localStorage.getItem("user_id"));

    const res = await axios.get(API, {
      params: { user: facultyId }
    });

    const uniqueMessages = Array.from(
  new Map(
    res.data.map((m: any) => [
      m.subject + m.body + m.sender, // 🔥 KEY CHANGE
      m
    ])
  ).values()
);

    console.log("API COUNT:", res.data.length);

    const mapped = uniqueMessages.map((m: any) => ({
      id: m.id,
      subject: m.subject,
      message: m.body || m.message,
      created_at: m.created_at,
      is_read: m.is_read,
      sender:
        m.sender === facultyId
          ? "You"
          : m.sender_name || `User ${m.sender}`,
    }));

    setMessages(mapped);
    setFiltered(mapped);

    if (mapped.length > 0) setSelected(mapped[0]);

  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    fetchingRef.current = false;   // ✅ release lock
  }
};
  const confirmDelete = async () => {
  try {
    if (!deleteId) return;

    await axios.delete(`${API}${deleteId}/`);

    // ✅ remove from UI instantly (NO refetch)
    setMessages(prev => prev.filter(m => m.id !== deleteId));
    setFiltered(prev => prev.filter(m => m.id !== deleteId));

    // ✅ clear selection safely
    setSelected(prev => (prev?.id === deleteId ? null : prev));

    setDeleteId(null);   // close popup
    setError("");        // clear popup error

    setSuccess("Message deleted successfully");

  } catch (err: any) {
    console.error(err.response?.data || err);
    setPopupError(
      err.response?.data?.error || "Delete failed"
    );
  }
};
  const openEdit = (msg: Message) => {
  setEditing(true);
  setEditData(msg);
  setSubject(msg.subject);
  setBody(msg.message);
};
  const fetchCourses = async () => {
    try {
      const facultyId = Number(localStorage.getItem("faculty_id"));

      const res = await axios.get(COURSE_API, {
        params: { faculty: facultyId }
      });

      setCourses(res.data);

    } catch (err) {
      console.error("Course fetch error:", err);
    }
  };

  const fetchStudentsByCourses = async (courseIds: number[]) => {

  if (courseIds.length === 0) {
    setStudents([])
    return
  }

  try {
    setLoadingStudents(true)

    let allStudents: any[] = []

    for (let courseId of courseIds) {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/students/?course=${courseId}`
      )

      allStudents = [...allStudents, ...res.data]
    }

    // remove duplicates
    const unique = Array.from(
      new Map(allStudents.map(s => [s.id, s])).values()
    )

    setStudents(unique)

  } catch (err) {
    console.error("Student fetch error:", err)
  } finally {
    setLoadingStudents(false)
  }
}
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
  const saveSearch = (value: string) => {
  if (!value.trim()) return

  let updated = [value, ...searchHistory.filter(v => v !== value)]
  updated = updated.slice(0, 5)

  setSearchHistory(updated)
  localStorage.setItem("faculty_message_search_history", JSON.stringify(updated))
}
  // 🔒 prevent multiple fetch calls
const hasFetched = useRef(false);

// 🔍 suggestions (safe)
const suggestions = messages
  .filter(m =>
    (m.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.sender || "").toLowerCase().includes(search.toLowerCase())
  )
  .slice(0, 5);

// 🚀 fetch only once
useEffect(() => {
  if (hasFetched.current) return;

  hasFetched.current = true;

  fetchMessages();
  fetchCourses();
}, []);
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowCourseDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  // ================= FILTER =================

  useEffect(() => {
    const value = search.toLowerCase();

    const data = messages.filter(m =>
      m.subject.toLowerCase().includes(value) ||
      m.sender.toLowerCase().includes(value) ||
      m.message.toLowerCase().includes(value)
    );

    setFiltered(data);
  }, [search, messages]);

  // ================= HANDLERS =================

  const toggleCourse = (id: number) => {
    setSelectedCourses(prev => {
      const updated = prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id];

      fetchStudentsByCourses(updated);
      setSelectedStudents([]); // reset students on course change

      return updated;
    });
  };

  const toggleStudent = (id: number) => {
    setSelectedStudents(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // ================= SEND =================

 const sendMessage = async () => {
  setError("");
  setSuccess("");

  if (!subject.trim() || !body.trim()) {
    setError("Subject and message required");
    return;
  }

  try {
    setSending(true);

    const senderId = Number(localStorage.getItem("user_id"));

    // ================= EDIT MODE =================
    if (editing && editData) {

      await axios.put(`${API}${editData.id}/`, {
        subject,
        message: body,
      });

      // ✅ update UI locally
      setMessages(prev =>
        prev.map(m =>
          m.id === editData.id
            ? { ...m, subject, message: body }
            : m
        )
      );

      setFiltered(prev =>
        prev.map(m =>
          m.id === editData.id
            ? { ...m, subject, message: body }
            : m
        )
      );

      setSuccess("Message updated successfully");

      setEditing(false);
      setEditData(null);
    } 

    // ================= CREATE MODE =================
    else {

      let payload: any = {
        sender: senderId,
        subject,
        message: body
      };

      if (selectedCourses.length > 0) {
        payload.courses = selectedCourses;
      } else {
        payload.broadcast = true;
      }

      console.log("FINAL PAYLOAD:", payload);

      const res = await axios.post(API, payload);

      // ✅ use backend response if available
      const newMsg = {
        id: res.data?.id || Date.now(),
        subject,
        message: body,
        created_at: new Date().toISOString(),
        is_read: false,
        sender: "You"
      };

      // ✅ update UI instantly (NO refetch)
      setMessages(prev => [newMsg, ...prev]);
      setFiltered(prev => [newMsg, ...prev]);
      setSelected(newMsg);

      setSuccess("Message sent successfully");
    }

    // ================= COMMON RESET =================
    setSubject("");
    setBody("");
    setSelectedCourses([]);


  } catch (err: any) {
    console.error(err.response?.data || err);
    setError("Failed to process message");
  } finally {
    setSending(false);
  }
};

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Messages
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT PANEL */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">

  {/* SEARCH */}
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
            e.currentTarget.blur()
          }
        }}
        className="w-full px-3 py-2 rounded-md 
        bg-background border border-border 
        hover:border-primary/40 
        focus:outline-none focus:ring-2 focus:ring-primary/20
        transition"
        style={{ WebkitBoxShadow: "0 0 0 1000px transparent inset" }}
      />

      {showDropdown && (
        <div className="absolute w-full bg-white border border-border rounded-xl shadow-lg mt-2 z-50 max-h-64 overflow-y-auto">

          {/* HISTORY */}
          {!search && searchHistory.length > 0 && (
            <div className="py-1">

              <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground">
                <span>Recent Searches</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("faculty_message_search_history")
                    setSearchHistory([])
                  }}
                  className="hover:text-red-500"
                >
                  Clear
                </button>
              </div>

              {searchHistory.map((item, i) => (
                <div key={i} className="flex justify-between px-3 py-2 hover:bg-muted/50 group">

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

                  <X
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation()
                      const updated = searchHistory.filter((_, idx) => idx !== i)
                      setSearchHistory(updated)
                      localStorage.setItem("faculty_message_search_history", JSON.stringify(updated))
                    }}
                    className="opacity-0 group-hover:opacity-100 cursor-pointer"
                  />

                </div>
              ))}
            </div>
          )}

          {/* SUGGESTIONS */}
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

  {/* MESSAGE LIST */}
  <div className="max-h-[500px] overflow-y-auto space-y-1 p-1">

    {currentMessages.map(m => (
      <div
        key={m.id}
        className={`group w-full px-4 py-3 rounded-xl border border-transparent
        transition-all duration-200 flex justify-between items-start

        ${selected?.id === m.id
          ? "bg-primary/10 border-primary/20 shadow-sm"
          : "hover:bg-muted/40 hover:border-border hover:shadow-sm"}
        `}
      >

        {/* CLICK AREA */}
        <button
          onClick={() => setSelected(m)}
          className="flex-1 text-left"
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`${!m.is_read ? "font-semibold" : ""}`}>
              {m.sender}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(m.created_at).toLocaleTimeString()}
            </span>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {m.subject}
          </p>
        </button>

        {/* ACTIONS */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">

          <button
            onClick={() => openEdit(m)}
            className="p-1.5 rounded text-blue-600 hover:bg-blue-100"
            title="Edit"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={() => setDeleteId(m.id)}
            className="p-1.5 rounded text-red-600 hover:bg-red-100"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>

        </div>

      </div>
    ))}

    {/* ✅ PAGINATION (ONLY ADDITION) */}
    {filtered.length > messagesPerPage && (
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
          : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md active:scale-95"
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
          : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md active:scale-95"
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
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* SEND CARD */}
          <div className="bg-card border border-border rounded-xl p-4">

            <h2 className="font-semibold mb-3">Send Message</h2>

            {success && (
  <div className="mb-3 px-3 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200 flex justify-between items-center text-sm">

    <span>{success}</span>

    <button
      onClick={() => setSuccess("")}
      className="text-green-600 hover:opacity-70 font-bold"
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
      className="text-red-600 hover:opacity-70 font-bold"
    >
      ✕
    </button>

  </div>
)}

            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <textarea
              placeholder="Message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            {/* COURSES */}
            {/* COURSE SELECT DROPDOWN */}
<div ref={dropdownRef} className="mb-3 relative">
  <label className="text-xs text-muted-foreground mb-1 block">
    Select Courses
  </label>

  {/* INPUT BOX */}
  <div
  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
  className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-border bg-background cursor-pointer flex flex-wrap gap-2 items-center"
>

  {selectedCourses.length === 0 && (
    <span className="text-sm text-muted-foreground">
      Select courses...
    </span>
  )}

  {courses
    .filter(c => selectedCourses.includes(c.id))
    .map(c => (
      <span
  key={c.id}
  className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${getColor(c.course_code)}`}
>
  {c.course_code}

  <button
    onClick={(e) => {
      e.stopPropagation()
      toggleCourse(c.id)
    }}
    className="text-xs text-muted-foreground hover:bg-muted rounded-full px-1 transition"
  >
    ×
  </button>
</span>
    ))}

  <div className="ml-auto text-xs text-muted-foreground">
    ▼
  </div>

</div>

  {/* DROPDOWN */}
  {showCourseDropdown && (
  <div
    onClick={(e) => e.stopPropagation()}
    className="absolute z-50 mt-2 w-full bg-card border border-border rounded-xl shadow-xl max-h-52 overflow-y-auto animate-in fade-in"
  >

    {courses.map(c => {
      const selected = selectedCourses.includes(c.id)

      return (
        <div
          key={c.id}
          onClick={() => toggleCourse(c.id)}
          className={`flex items-center justify-between px-3 py-2 cursor-pointer transition ${
            selected
              ? "bg-primary/10 text-primary"
              : "hover:bg-muted/40"
          }`}
        >
          <span className="text-sm">
            {c.course_code} - {c.course_name}
          </span>

          {selected && (
            <span className="text-primary text-xs">✔</span>
          )}
        </div>
      )
    })}

  </div>
)}

</div>
            <button
              onClick={sendMessage}
              disabled={sending}
              className="w-full py-2.5 rounded-lg text-sm font-medium
bg-primary text-white 
hover:bg-primary/90 
transition-all duration-200 
shadow-sm hover:shadow-md 
active:scale-95 
disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

          </div>
          {deleteId && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[320px] text-center shadow-lg">

      <p className="mb-3 text-sm font-medium">
        Delete this message?
      </p>

      {/* ❗ ERROR INSIDE POPUP */}
      {popupError && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs">
          {popupError}
        </div>
      )}

      <div className="flex justify-center gap-4">

        <button
          onClick={()=>{
            setDeleteId(null);
            setPopupError("");   // ✅ reset error
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>

      </div>

    </div>

  </div>
)}
          {/* MESSAGE VIEW */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col flex-1">

            {!selected && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
  <p className="text-sm">No message selected</p>
  <span className="text-xs">Choose a conversation 👈</span>
</div>
            )}

            {selected && (
              <>
                <div className="border-b pb-3 mb-4 flex justify-between items-start">

  <div>
    <h3 className="font-semibold">{selected.sender}</h3>
    <p className="text-sm text-muted-foreground">
      {selected.subject}
    </p>
  </div>

  {/* ACTIONS */}
  <div className="flex gap-2">

    <button
      onClick={() => openEdit(selected)}
      className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition"
      title="Edit"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={() => setDeleteId(selected.id)}
      className="p-1.5 rounded text-red-600 hover:bg-red-100 transition"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>

  </div>

</div>

                <div className="flex-1">
                  <div className="bg-muted/40 p-4 rounded-xl border border-border text-sm leading-relaxed shadow-inner">
                    {selected.message}
                  </div>
                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyMessages;