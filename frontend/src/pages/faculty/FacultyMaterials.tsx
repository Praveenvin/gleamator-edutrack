import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Upload, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  id: number;
  title: string;
  course: number;
  course_name?: string;
  file: string;
  created_at?: string;
  downloads: number;
}

interface Course {
  id: number;
  course_name: string;
}

const FacultyMaterials = () => {

  const [uploads, setUploads] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  /* FETCH MATERIALS */
  const fetchMaterials = async () => {
    try {
      const facultyId = localStorage.getItem("faculty_id");

const res = await axios.get(
  "http://127.0.0.1:8000/api/materials/",
  {
    params: { faculty: facultyId }
  }
);
      setUploads(res.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  /* FETCH COURSES */
  const fetchCourses = async () => {
    try {
      const facultyId = localStorage.getItem("faculty_id");

const res = await axios.get(
  "http://127.0.0.1:8000/api/courses/",
  {
    params: { faculty: facultyId }
  }
);
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  /* UPLOAD MATERIAL */
  const uploadMaterial = async () => {
    try {

      if (!selectedCourse || !title || !file) {
        alert("All fields required");
        return;
      }

      const formData = new FormData();
      formData.append("course", selectedCourse);
      formData.append("title", title);
      formData.append("file", file);

      await axios.post("http://127.0.0.1:8000/api/materials/", formData);

      setTitle("");
      setFile(null);
      setSelectedCourse("");

      fetchMaterials();

    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Upload Study Materials
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* UPLOAD SECTION */}
        <div className="lg:col-span-1 bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold mb-4">
            Upload New Material
          </h2>

          <div className="space-y-4">

            {/* COURSE */}
            <div>
              <label className="text-sm text-muted-foreground">Course</label>
              <select
                value={selectedCourse}
                onChange={(e)=>setSelectedCourse(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="">Select Course</option>

                {courses.map(c=>(
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="Enter material title"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            {/* FILE UPLOAD (STYLED) */}
            <div className="border border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition">

              <input
                type="file"
                className="hidden"
                id="materialUpload"
                onChange={(e)=>setFile(e.target.files?.[0] || null)}
              />

              {!file ? (
                <label htmlFor="materialUpload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload file
                  </p>
                </label>
              ) : (
                <div className="flex justify-between items-center bg-secondary/40 px-4 py-3 rounded-lg">
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
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

            {/* BUTTON */}
            <button
              onClick={uploadMaterial}
              className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            >
              Upload Material
            </button>

          </div>
        </div>

        {/* MATERIALS TABLE */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold mb-4">
            Uploaded Materials
          </h2>

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-border">
                {["Title", "Course", "Type", "Date", "Downloads"].map(h=>(
                  <th key={h} className="text-left py-2 text-muted-foreground font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {uploads.map(u=>{

                const fileType = u.file?.split(".").pop()?.toUpperCase();

                return (
                  <tr key={u.id} className="border-b border-border">

                    <td className="py-2.5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {u.title}
                    </td>

                    <td className="py-2.5 text-muted-foreground">
                      {courses.find(c=>c.id === u.course)?.course_name || u.course}
                    </td>

                    <td className="py-2.5">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                        {fileType}
                      </span>
                    </td>

                    <td className="py-2.5 text-muted-foreground">
                      {u.created_at?.slice(0,10) || "-"}
                    </td>

                    <td className="py-2.5">
                      {u.downloads}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyMaterials;