import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  file_url?: string;
  status?: string;
}

const API = "http://127.0.0.1:8000/api/assignments/";

const FacultyAssignments = () => {

  const [adminAssignments, setAdminAssignments] = useState<Assignment[]>([]);
  const [myAssignments, setMyAssignments] = useState<Assignment[]>([]);
  const [submitModal, setSubmitModal] = useState(false);
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [message, setMessage] = useState<string | null>(null); 
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    due_date: ""
  });
  const openSubmitModal = (a: Assignment) => {
  setCurrentAssignment(a);
  setSubmitFile(null);
  setSubmitModal(true);
  setSubmitError("");    
};


  /* FETCH */

  const fetchAssignments = async () => {

  const facultyId = localStorage.getItem("faculty_id");

  const res = await axios.get(API, {
    params: { faculty: facultyId }   // ✅ SAFE WAY
  });

  const admin = res.data.filter((a:any) => a.created_by === "admin");
  const faculty = res.data.filter((a:any) => a.created_by === "faculty");

  setAdminAssignments(admin);
  setMyAssignments(faculty);
};
  useEffect(()=>{
    fetchAssignments();
  },[]);

  /* HANDLERS */

  const handleChange = (e:any)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const openAdd = ()=>{
    setEditing(false);
    setFile(null);
    setFormError(null);
    setForm({id:0,title:"",description:"",due_date:""});
    setShowModal(true);
  };

  const openEdit = (a:Assignment)=>{
    setEditing(true);
    setFile(null);
    setFormError(null);
    setForm(a);
    setShowModal(true);
  };
  
  /* SAVE */

  const saveAssignment = async () => {

  if (!form.title || !form.due_date) {
    setFormError("All fields are required");
    return;
  }

  try {

    const formData = new FormData();
    const userId = localStorage.getItem("faculty_id");
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("due_date", form.due_date);
    formData.append("faculty", userId || "");
    formData.append("created_by", "faculty"); 
    if (file) {
      formData.append("file", file);
    }

    if (editing) {
      await axios.put(`${API}${form.id}/`, formData);
    } else {
      await axios.post(API, formData);
    }

    setShowModal(false);
    fetchAssignments();

  } catch {
    setFormError("Error saving assignment");
  }
};
const submitAssignment = async () => {
  try {

    if (!submitFile) {
      setSubmitError("Please select a file");
      return;
    }

    const userId = localStorage.getItem("faculty_id");

    const formData = new FormData();
    formData.append("assignment", String(currentAssignment?.id));
    formData.append("faculty", userId || "");           // ✅ FIX
    formData.append("submitted_by", "faculty");         // ✅ FIX
    formData.append("file", submitFile);

    await axios.post(
      "http://127.0.0.1:8000/api/submit-assignment/",
      formData
    );

    setSubmitModal(false);
    setSubmitFile(null);
    setSubmitError("");

    setMessage("Assignment submitted successfully");

    fetchAssignments();

  } catch (err) {
    console.error(err);
    setSubmitError("Submission failed. Try again.");
  }
};
  /* DELETE */

  const confirmDelete = async () => {
    if (!deleteId) return;

    await axios.delete(`${API}${deleteId}/`);
    setDeleteId(null);
    fetchAssignments();
  };

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Assignments
      </h1>
      {message && (
  <div className={`mb-4 px-4 py-2 rounded-lg text-sm flex justify-between items-center ${
    message.toLowerCase().includes("error")
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700"
  }`}>
    {message}
    <button onClick={()=>setMessage(null)}>✕</button>
  </div>
)}
      {/* ADMIN ASSIGNMENTS */}

      <div className="mb-8">

        <h2 className="text-lg font-semibold mb-4">
          Assignments from Admin
        </h2>

        <div className="bg-card rounded-lg border border-border overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-secondary/50">
              <tr>
                {["Title","Due Date","File","Action"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {adminAssignments.map(a=>(
                <tr key={a.id} className="border-t border-border hover:bg-secondary/40 transition">

                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3">{a.due_date}</td>

                  <td className="px-4 py-3">
                    {a.file_url ? (
                      <button
                        onClick={()=>{setSelected(a);setViewModal(true);}}
                        className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
                      >
                        View File
                      </button>
                    ) : "-"}
                  </td>

                  <td className="px-4 py-3">
  {a.status === "Submitted" ? (
    <button
      onClick={() => openSubmitModal(a)}
      className="px-3 py-1.5 text-xs rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
    >
      Edit Submission
    </button>
  ) : (
    <button
      onClick={() => openSubmitModal(a)}
      className="px-3 py-1.5 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
    >
      Submit
    </button>
  )}
</td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

      {/* MY ASSIGNMENTS */}

      <div>

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold">
            My Assignments
          </h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition"
          >
            <Plus size={18}/>
            Create Assignment
          </button>

        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-secondary/50">
              <tr>
                {["Title","Due Date","File","Actions"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {myAssignments.map(a=>(
                <tr key={a.id} className="border-t border-border hover:bg-secondary/40 transition">

                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3">{a.due_date}</td>

                  <td className="px-4 py-3">
                    {a.file_url ? (
                      <button
                        onClick={()=>{setSelected(a);setViewModal(true);}}
                        className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary"
                      >
                        View File
                      </button>
                    ) : "-"}
                  </td>

                  <td className="px-4 py-3 flex gap-2">

                    <button
                      onClick={()=>openEdit(a)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition"
                    >
                      <Pencil size={16}/>
                    </button>

                    <button
                      onClick={()=>setDeleteId(a.id)}
                      className="p-1.5 rounded text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={16}/>
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                {editing ? "Edit Assignment" : "Create Assignment"}
              </h2>
              <button onClick={()=>setShowModal(false)}>
                <X size={18}/>
              </button>
            </div>

            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3">

              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border px-3 py-2 rounded-lg text-sm"/>

              <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="border px-3 py-2 rounded-lg text-sm"/>

              {/* UPLOAD */}
              <div className="border border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition">

                <input
                  type="file"
                  onChange={(e)=>setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="facultyUpload"
                />

                {!file ? (
                  <label htmlFor="facultyUpload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">↑</div>
                    <p className="text-sm text-muted-foreground">Click to upload file</p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-secondary/40 px-4 py-3 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={()=>setFile(null)} className="text-red-600 text-xs hover:underline">Remove</button>
                  </div>
                )}

              </div>

              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border px-3 py-2 rounded-lg text-sm"/>

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">
                Cancel
              </button>

              <button
                onClick={saveAssignment}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm shadow hover:bg-primary/90 transition"
              >
                {editing ? "Update" : "Create"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* VIEW MODAL */}

      {viewModal && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[520px] shadow-lg">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Assignment Details</h2>
              <button onClick={()=>setViewModal(false)}>
                <X size={18}/>
              </button>
            </div>

            <p className="font-medium">{selected.title}</p>
            <p className="text-sm text-muted-foreground">{selected.description}</p>

            {selected.file_url && (
              <div className="mt-4 bg-secondary/40 border border-border rounded-lg p-4 flex justify-between items-center">

                <div>
                  <p className="text-sm font-medium">Attachment</p>
                  <p className="text-xs text-muted-foreground">Open in new tab</p>
                </div>

                <div className="flex gap-2">

                  <a
                    href={`http://127.0.0.1:8000${selected.file_url}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition"
                  >
                    Preview
                  </a>

                  <a
                    href={`http://127.0.0.1:8000${selected.file_url}`}
                    download
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs hover:bg-primary/90 transition"
                  >
                    Download
                  </a>

                </div>

              </div>
            )}

          </div>

        </div>
      )}
      {submitModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[420px]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Submit Assignment
        </h2>
        <button onClick={()=>setSubmitModal(false)}>✕</button>
      </div>

      {/* ERROR ONLY */}
      {submitError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {submitError}
        </div>
      )}

      {/* FILE INPUT */}
      <div className="border border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition">

  <input
    type="file"
    onChange={(e)=>setSubmitFile(e.target.files?.[0] || null)}
    className="hidden"
    id="submitUpload"
  />

  {!submitFile ? (
    <label htmlFor="submitUpload" className="cursor-pointer flex flex-col items-center gap-2">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        ↑
      </div>
      <p className="text-sm text-muted-foreground">
        Click to upload file
      </p>
    </label>
  ) : (
    <div className="flex items-center justify-between bg-secondary/40 px-4 py-3 rounded-lg">
      <div className="text-left">
        <p className="text-sm font-medium">{submitFile.name}</p>
        <p className="text-xs text-muted-foreground">
          {(submitFile.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        onClick={()=>setSubmitFile(null)}
        className="text-red-600 text-xs hover:underline"
      >
        Remove
      </button>
    </div>
  )}

</div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={()=>setSubmitModal(false)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={submitAssignment}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Submit
        </button>
      </div>

    </div>

  </div>
)}
      {/* DELETE MODAL */}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[340px] text-center shadow-lg">

            <h2 className="text-lg font-semibold mb-2">
              Delete Assignment
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              This action cannot be undone. Are you sure?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={()=>setDeleteId(null)}
                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 shadow"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </FacultyDashboardLayout>
  );
};

export default FacultyAssignments;