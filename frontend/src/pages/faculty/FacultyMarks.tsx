import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
interface Student {
  id: number;
  name: string;
  usn: string;
}

interface Course {
  id: number;
  course_name: string;
  course_code: string;
}

const STUDENTS_API = "http://127.0.0.1:8000/api/students/";
const COURSES_API = "http://127.0.0.1:8000/api/courses/";
const MARKS_API = "http://127.0.0.1:8000/api/marks/";

const FacultyMarks = () => {

  const [students,setStudents] = useState<Student[]>([]);
  const [courses,setCourses] = useState<Course[]>([]);
  const [selectedCourse,setSelectedCourse] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [marks,setMarks] = useState<Record<number,{IA1:number,IA2:number,FINAL:number}>>({});
  const navigate = useNavigate();
  const [message,setMessage] = useState<string | null>(null);
  const [error,setError] = useState<string | null>(null);
  const [saving,setSaving] = useState(false);

  const [showUpload,setShowUpload] = useState(false);
  const [file,setFile] = useState<File | null>(null);
  const [uploadError,setUploadError] = useState<string | null>(null);

  const [csvPreview,setCsvPreview] = useState<any[]>([]);
  const [showPreview,setShowPreview] = useState(false);
  const [uploaded,setUploaded] = useState(false);

  // ================= FETCH =================
  const getGrade = (m: { IA1: number; IA2: number; FINAL: number }) => {
  let score = 0;
  let max = 100;

  if (m.FINAL > 0) {
    score = m.FINAL;
    max = 100;
  } else if (m.IA1 > 0 && m.IA2 > 0) {
    score = (m.IA1 + m.IA2) / 2;
    max = 40;
  } else if (m.IA1 > 0) {
    score = m.IA1;
    max = 40;
  } else {
    return { grade: "-", color: "bg-gray-100 text-gray-600" };
  }

  const percent = (score / max) * 100;

  if (percent >= 85) return { grade: "A+", color: "bg-purple-100 text-purple-700" };
  if (percent >= 75) return { grade: "A", color: "bg-green-100 text-green-700" };
  if (percent >= 65) return { grade: "B", color: "bg-blue-100 text-blue-700" };
  if (percent >= 55) return { grade: "C", color: "bg-yellow-100 text-yellow-700" };
  if (percent >= 50) return { grade: "D", color: "bg-orange-100 text-orange-700" };

  return { grade: "F", color: "bg-red-100 text-red-700" };
};
  const fetchCourses = async ()=>{
    const facultyId = localStorage.getItem("faculty_id");
    const res = await axios.get(COURSES_API,{ params:{ faculty:facultyId } });
    setCourses(res.data);
    if(res.data.length > 0) setSelectedCourse(res.data[0].id);
  };

  const fetchStudentsAndMarks = async(courseId:number)=>{
    const studentsRes = await axios.get(STUDENTS_API,{ params:{ course:courseId }});
    const marksRes = await axios.get(MARKS_API,{ params:{ course:courseId }});

    setStudents(studentsRes.data);

    const initial:any = {};
    studentsRes.data.forEach((s:Student)=>{
      initial[s.id] = { IA1:0, IA2:0, FINAL:0 };
    });

    marksRes.data.forEach((m:any)=>{
      if(initial[m.student]){
        initial[m.student][m.exam_type] = m.marks;
      }
    });

    setMarks(initial);
  };

  useEffect(()=>{ fetchCourses(); },[]);
  useEffect(()=>{ if(selectedCourse) fetchStudentsAndMarks(selectedCourse); },[selectedCourse]);

  // ================= UPDATE =================

  const updateMark = (id:number,type:string,value:number)=>{
    setMarks({
      ...marks,
      [id]:{
        ...marks[id],
        [type]:value
      }
    });
  };

  // ================= SAVE =================

  const submitMarks = async () => {
  try {
    setSaving(true);

    for (const studentId in marks) {
      const m = marks[studentId];

      // 🔥 ALWAYS SEND (even if 0)
      await axios.post(MARKS_API, {
        student: studentId,
        course: selectedCourse,
        marks: m.IA1,
        exam_type: "IA1",
      });

      await axios.post(MARKS_API, {
        student: studentId,
        course: selectedCourse,
        marks: m.IA2,
        exam_type: "IA2",
      });

      await axios.post(MARKS_API, {
        student: studentId,
        course: selectedCourse,
        marks: m.FINAL,
        exam_type: "FINAL",
      });
    }

    setMessage("Marks saved successfully");

    // 🔥 REFRESH FROM BACKEND (IMPORTANT)
    if (selectedCourse) {
      fetchStudentsAndMarks(selectedCourse);
    }

  } catch (err) {
    setError("Error saving marks");
  } finally {
    setSaving(false);
  }
};

  // ================= CSV =================

  const handleCSV = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  const processData = (data: any[]) => {
    setCsvPreview(data);   // 🔥 store parsed data
  };

  if (ext === "csv") {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const rows = e.target.result.split("\n").map((r: string) => r.split(","));
      const headers = rows[0].map((h: string) => h.trim().toUpperCase());

      const parsed: any[] = [];

      rows.slice(1).forEach((row: any) => {
        const obj: any = {};
        headers.forEach((h: string, i: number) => {
          obj[h] = row[i];
        });
        parsed.push(obj);
      });

      processData(parsed);
    };

    reader.readAsText(file);
  }

  else if (ext === "xlsx") {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      processData(json);
    };

    reader.readAsArrayBuffer(file);
  }

  else {
    setUploadError("Only CSV or Excel allowed");
  }
};

  const applyCSV = () => {
  if (!csvPreview.length) {
    setUploadError("No data to apply");
    return;
  }

  const updated = { ...marks };

  csvPreview.forEach((row: any) => {
    const student = students.find(
      (s) => s.usn.toUpperCase() === row.USN?.toUpperCase()
    );

    if (!student) return;

    if (row.IA1 !== undefined && row.IA1 !== "")
      updated[student.id].IA1 = Number(row.IA1);

    if (row.IA2 !== undefined && row.IA2 !== "")
      updated[student.id].IA2 = Number(row.IA2);

    if (row.FINAL !== undefined && row.FINAL !== "")
      updated[student.id].FINAL = Number(row.FINAL);
  });

  setMarks(updated);
  setUploaded(true);

  // 🔥 UX PART
  setMessage("Marks applied successfully");
  setShowUpload(false);
  setFile(null);
  setCsvPreview([]);
};

  // ================= PHASE =================

  const getPhase = ()=>{
    let f=false,i2=false,i1=false;

    students.forEach(s=>{
      const m = marks[s.id] || {IA1:0,IA2:0,FINAL:0};
      if(m.FINAL>0) f=true;
      if(m.IA2>0) i2=true;
      if(m.IA1>0) i1=true;
    });

    if(f) return "FINAL";
    if(i2) return "IA2";
    if(i1) return "IA1";
    return "NONE";
  };

  const phase = getPhase();
let totalSum = 0;
let evaluated = 0;
let failed = 0;

let topper = { name: "", marks: 0 };
let maxMarks = phase === "FINAL" ? 100 : 40;

students.forEach((s) => {
  const m = marks[s.id] || { IA1: 0, IA2: 0, FINAL: 0 };

  let score = 0;

  if (phase === "FINAL") {
    if (m.FINAL > 0) score = m.FINAL;   // ✅ ONLY FINAL
    else return; // ❌ ignore IA students
  }

  else if (phase === "IA2") {
    if (m.IA1 > 0 && m.IA2 > 0) {
      score = (m.IA1 + m.IA2) / 2;
    } else return; // ignore incomplete
  }

  else if (phase === "IA1") {
    if (m.IA1 > 0) score = m.IA1;
    else return;
  }

  evaluated++;
  totalSum += score;

  if (score < maxMarks * 0.4) failed++;

  if (score > topper.marks) {
    topper = { name: s.name, marks: score };
  }
});

const avg = evaluated ? (totalSum / evaluated).toFixed(1) : 0;
const pass = evaluated
  ? (((evaluated - failed) / evaluated) * 100).toFixed(1)
  : 0;

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold mb-4">
        Internal Marks ({phase})
      </h1>

      {/* MESSAGE */}
      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 flex justify-between">
          {message}
          <button onClick={()=>setMessage(null)}>✕</button>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex gap-3 mb-6">

  <select
  value={selectedCourse ?? ""}
  onChange={(e) => setSelectedCourse(Number(e.target.value))}
  className="
    px-3 py-2 rounded-md
    bg-background
    border border-border
    text-foreground text-sm
    transition-all duration-200

    hover:bg-muted/40
    hover:border-primary/40

    focus:outline-none
    focus:ring-2 focus:ring-primary/40
    focus:border-primary
  "
>
    {courses.map(c=>(
      <option key={c.id} value={c.id}>
        {c.course_code} - {c.course_name}
      </option>
    ))}
  </select>

  <button
    onClick={()=>setShowUpload(true)}
    className="px-4 py-2 border border-border rounded-md hover:bg-muted/40 transition"
  >
    Upload
  </button>

  <button
    onClick={()=>{
      if(isEditing){
        submitMarks();
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }}
    className={`px-4 py-2 rounded-md text-white transition ${
      isEditing
        ? "bg-green-600 hover:bg-green-700"
        : "bg-primary hover:bg-primary/90"
    }`}
  >
    {isEditing ? "Save Changes" : "Edit Marks"}
  </button>

</div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

  <div className="bg-card border border-border rounded-xl p-5">
    <p className="text-sm text-muted-foreground">Average Score</p>
    <h2 className="text-2xl font-bold text-primary">{avg}</h2>
    <p className="text-xs text-muted-foreground mt-1">
      Based on {evaluated} students
    </p>
  </div>

  <div className="bg-card border border-border rounded-xl p-5">
    <p className="text-sm text-muted-foreground">Failed</p>
    <h2 className="text-2xl font-bold text-red-500">{failed}</h2>
    <p className="text-xs text-muted-foreground mt-1">
      Below pass criteria
    </p>
  </div>

  <div className="bg-card border border-border rounded-xl p-5">
    <p className="text-sm text-muted-foreground">Pass %</p>
    <h2 className="text-2xl font-bold text-green-500">{pass}%</h2>
    <p className="text-xs text-muted-foreground mt-1">
      Success rate
    </p>
  </div>

  <div className="bg-card border border-border rounded-xl p-5">
    <p className="text-sm text-muted-foreground">Top Performer</p>
    <h2 className="text-lg font-semibold">{topper.name || "-"}</h2>
    <p className="text-sm text-muted-foreground">
      {topper.marks}/{maxMarks}
    </p>
  </div>

</div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">

  <table className="w-full text-sm">

    {/* HEADER */}
    <thead className="bg-muted/50">
      <tr>
        <th className="px-4 py-3 text-left">ID</th>
        <th className="px-4 py-3 text-left">Name</th>
        <th className="px-4 py-3 text-center">IA1</th>
        <th className="px-4 py-3 text-center">IA2</th>
        <th className="px-4 py-3 text-center">FINAL</th>
        <th className="px-4 py-3 text-center">Grade</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {students.map((s) => {
        const m = marks[s.id] || { IA1: 0, IA2: 0, FINAL: 0 };

        return (
          <tr
            key={s.id}
            className="border-t hover:bg-muted/40 transition-all duration-200"
          >
            {/* ID */}
            <td className="px-4 py-3">{s.id}</td>

            {/* NAME */}
            <td className="px-4 py-3 font-medium">
  <span
    onClick={() => navigate(`/admin-dashboard/student/${s.id}`)}
    className="cursor-pointer text-foreground hover:opacity-70"
  >
    {s.name}
  </span>
</td>

            {/* MARKS */}
            {["IA1", "IA2", "FINAL"].map((t) => {

              const value = (m as any)[t];

              return (
                <td key={t} className="px-4 py-3 text-center">

                  {isEditing ? (
                    <input
                      type="number"
                      value={value}
                      min={0}
                      max={t === "FINAL" ? 100 : 40}
                      onChange={(e) => {
                        let val = Number(e.target.value);

                        if (val < 0) val = 0;
                        if (t === "FINAL" && val > 100) val = 100;
                        if (t !== "FINAL" && val > 40) val = 40;

                        updateMark(s.id, t, val);
                      }}

                      /* 🔥 Scoped arrow removal */
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield"
                      }}

                      className="w-16 text-center rounded-md border border-border 
                                 focus:outline-none focus:ring-2 focus:ring-primary/40 
                                 transition"
                    />
                  ) : (
                    <span className="px-2 py-1 text-sm">
                      {value}
                    </span>
                  )}

                </td>
              );
            })}

            {/* GRADE */}
<td className="px-4 py-3 text-center text-xs">
  {(() => {
    const g = getGrade(m);

    return (
      <span
        className={`${g.color} px-3 py-1 rounded-full font-semibold`}
      >
        {g.grade}
      </span>
    );
  })()}
</td>

          </tr>
        );
      })}
    </tbody>

  </table>
      
</div>
{showUpload && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-card border border-border rounded-xl w-[480px] p-6 shadow-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Upload Marks
        </h2>

        <button
          onClick={() => setShowUpload(false)}
          className="text-muted-foreground hover:text-foreground transition"
        >
          ✕
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {uploadError && (
        <div className="mb-4 px-4 py-2 rounded-md bg-red-100 text-red-700 text-sm">
          {uploadError}
        </div>
      )}

      {/* FILE INPUT */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/40 transition">

        <span className="text-sm text-muted-foreground mb-2">
          {file ? file.name : "Click to upload CSV or Excel"}
        </span>

        <span className="text-xs text-muted-foreground">
          Supported: .csv, .xlsx
        </span>

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => {
            const f = e.target.files?.[0];

            if (!f) {
              setUploadError("Please select a file");
              return;
            }

            setFile(f);
            setUploadError(null);
          }}
          className="hidden"
        />
      </label>

      {/* FORMAT SECTION */}
      <div className="mt-4 text-sm text-muted-foreground">

        <p className="mb-1 font-medium">Expected Format:</p>

        <div className="bg-muted p-2 rounded text-xs font-mono">
          USN,Name,IA1,IA2,FINAL
        </div>

        <a
  href="/sample.csv"
  download
  className="text-primary text-sm mt-2 inline-block underline hover:opacity-80"
>
  Download Sample File
</a>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => {
            setShowUpload(false);
            setFile(null);
            setUploadError(null);
          }}
          className="px-4 py-2 border border-border rounded-md hover:bg-muted/40 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!file) {
              setUploadError("Please select a file first");
              return;
            }

            handleCSV(file);   // parse
            applyCSV();        // apply directly
          }}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
        >
          Apply Changes
        </button>

      </div>

    </div>
  </div>
)}
    </FacultyDashboardLayout>
  );
};

export default FacultyMarks;