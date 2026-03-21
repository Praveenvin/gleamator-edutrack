import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { X, Upload } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  due: string;
  status: string;
}

const STUDENT_ID = 103;

const statusStyle: Record<string,string> = {
  Submitted: "text-green-600 bg-green-100",
  Pending: "text-yellow-600 bg-yellow-100",
  Late: "text-red-600 bg-red-100"
};

const Assignments = () => {

  const [assignments,setAssignments] = useState<Assignment[]>([]);

  const [showModal,setShowModal] = useState(false);
  const [selected,setSelected] = useState<Assignment | null>(null);
  const subjectPalette = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-slate-100 text-slate-700",
  "bg-cyan-100 text-cyan-700",
  "bg-violet-100 text-violet-700",
  "bg-zinc-100 text-zinc-700",
  "bg-sky-100 text-sky-700",
];
  const subjectColorMap: Record<string, string> = {};
  let colorIndex = 0;
  const [file,setFile] = useState<File | null>(null);
  const getSubjectColor = (subject: string) => {
    if (!subjectColorMap[subject]) {
      subjectColorMap[subject] =
        subjectPalette[colorIndex % subjectPalette.length];
      colorIndex++;
    }
    return subjectColorMap[subject];
  };
  const [message,setMessage] = useState<string | null>(null);
  const [formError,setFormError] = useState<string | null>(null);

  useEffect(()=>{ fetchAssignments() },[]);

  const fetchAssignments = async () => {

    const res = await axios.get(
      `http://127.0.0.1:8000/api/assignments/?student=${STUDENT_ID}`
    );

    const formatted = res.data.map((a:any)=>({
      id: a.id,
      title: a.title,
      subject: a.subject,
      due: a.due_date,
      status: a.status
    }));

    setAssignments(formatted);
  };

  const isLate = (due:string) => new Date() > new Date(due);

  const openSubmit = (a:Assignment)=>{
    setSelected(a);
    setFile(null);
    setFormError(null);
    setShowModal(true);
  };

  const submitAssignment = async () => {

    if(!file || !selected){
      setFormError("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("student",STUDENT_ID.toString());
    formData.append("assignment",selected.id.toString());
    formData.append("file",file);
    formData.append("status","Submitted");

    try{
      await axios.post("http://127.0.0.1:8000/api/submit-assignment/",formData);

      setMessage("Assignment submitted successfully");
      setShowModal(false);
      fetchAssignments();

    }catch{
      setFormError("Submission failed");
    }
  };

  return (
  <DashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">
      Assignments
    </h1>

    {/* SUCCESS MESSAGE */}
    {message && (
      <div className="mb-4 px-4 py-2 rounded-lg text-sm flex justify-between bg-green-100 text-green-700">
        {message}
        <button onClick={()=>setMessage(null)}>✕</button>
      </div>
    )}

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-secondary/50">
          <tr>
            {["Title","Subject","Due Date","Status","Actions"].map(h=>(
              <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {assignments.map(a=>{

            const late = isLate(a.due);
            const submitted = a.status === "Submitted";

            return (
              <tr key={a.id} className="border-t border-border hover:bg-secondary/40 transition">

                <td className="px-4 py-3 font-medium text-foreground">
                  {a.title}
                </td>

                <td className="px-4 py-3">
  <span
  className={`px-3 py-1 text-xs rounded-full ${getSubjectColor(a.subject)}`}
>
  {a.subject}
</span>
</td>

                <td className="px-4 py-3">
  <span
    className={`text-sm ${
      new Date(a.due) < new Date()
        ? "text-red-600 font-medium"
        : "text-muted-foreground"
    }`}
  >
    {a.due}
  </span>
</td>

                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[a.status]}`}>
                    {late && !submitted ? "Late" : a.status}
                  </span>
                </td>

                <td className="px-4 py-3">

                  {submitted ? (

                    <button
                      onClick={()=>openSubmit(a)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
                    >
                      Edit
                    </button>

                  ) : (

                    <button
                      onClick={()=>openSubmit(a)}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg text-xs hover:bg-primary/90 transition"
                    >
                      <Upload size={14}/>
                      {late ? "Submit Late" : "Submit"}
                    </button>

                  )}

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>

    {/* SUBMIT MODAL */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">

          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-lg">
              Submit Assignment
            </h2>
            <button onClick={()=>setShowModal(false)}>
              <X size={18}/>
            </button>
          </div>

          {formError && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-3">
              {formError}
            </div>
          )}

          {/* FILE UPLOAD */}
          <div className="border border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition">

            <input
              type="file"
              onChange={(e)=>setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="upload"
            />

            {!file ? (
              <label htmlFor="upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  ↑
                </div>
                <p className="text-sm text-muted-foreground">
                  Click to upload file
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports all file types
                </p>
              </label>
            ) : (
              <div className="flex items-center justify-between bg-secondary/40 px-4 py-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size/1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={()=>setFile(null)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

          </div>

          <div className="flex justify-end gap-3 mt-5">

            <button
              onClick={()=>setShowModal(false)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-secondary transition"
            >
              Cancel
            </button>

            <button
              onClick={submitAssignment}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition"
            >
              Submit
            </button>

          </div>

        </div>

      </div>
    )}

  </DashboardLayout>
  );
};

export default Assignments;