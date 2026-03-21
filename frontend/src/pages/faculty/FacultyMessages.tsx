import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useState, useEffect ,useRef} from "react";
import axios from "axios";

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
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ================= FETCH =================

  const fetchMessages = async () => {
    try {
      const facultyId = Number(localStorage.getItem("user_id"));

const res = await axios.get(API);

const mapped = res.data
  .filter((m: any) => m.sender === facultyId || m.receiver === facultyId)
  .map((m: any) => ({
    id: m.id,
    subject: m.subject,
    message: m.body,
    created_at: m.created_at,
    is_read: m.is_read,
    sender:
      m.sender === facultyId
        ? "You"
        : `Student`,
  }));

      setMessages(mapped);
      setFiltered(mapped);

      if (mapped.length > 0) setSelected(mapped[0]);

    } catch (err) {
      console.error("Fetch error:", err);
    }
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

    let payload: any = {
      sender: senderId,
      subject,
      message: body   // ✅ IMPORTANT
    };

    // ✅ COURSE BASED
    if (selectedCourses.length > 0) {
      payload.courses = selectedCourses;
    }

    // ✅ BROADCAST
    else {
      payload.broadcast = true;
    }

    console.log("FINAL PAYLOAD:", payload);

    await axios.post(API, payload);

    setSuccess("Message sent successfully");

    // reset
    setSubject("");
    setBody("");
    setSelectedCourses([]);

    fetchMessages();

  } catch (err: any) {
    console.error(err.response?.data || err);
    setError("Failed to send message");
  } finally {
    setSending(false);
  }
};

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Messages
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">

          <div className="p-3 border-b border-border">
            <input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto divide-y">

            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className={`w-full text-left px-4 py-3 transition ${
                  selected?.id === m.id
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-primary/5 hover:shadow-sm"
                }`}
              >
                <div className="flex justify-between">
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
            ))}

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* SEND CARD */}
          <div className="bg-card border border-border rounded-xl p-4">

            <h2 className="font-semibold mb-3">Send Message</h2>

            {success && (
  <div className="mb-3 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 text-sm border border-green-500/20 flex items-center justify-between">

    <span>{success}</span>

    <button
      onClick={() => setSuccess("")}
      className="ml-3 text-green-600 hover:opacity-70 text-sm font-bold transition"
    >
      ✕
    </button>

  </div>
)}

            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm border border-red-500/20">
                {error}
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
  className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
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
              className="w-full py-2 rounded-lg bg-primary text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

          </div>

          {/* MESSAGE VIEW */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col flex-1">

            {!selected && (
              <div className="text-muted-foreground text-center">
                Select a message
              </div>
            )}

            {selected && (
              <>
                <div className="border-b pb-3 mb-4">
                  <h3 className="font-semibold">{selected.sender}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selected.subject}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="bg-muted/50 p-4 rounded-lg">
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