import { DashboardLayout } from "@/components/DashboardLayout";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  id: number
  title: string
  course: number
  course_name: string      // ✅ ADD
  faculty_name: string 
  file: string
  uploaded_at: string
  downloads: number
}

const FILE_BASE = "http://127.0.0.1:8000";

const StudyMaterial = () => {

  const [materials,setMaterials] = useState<Material[]>([])
  const [loading,setLoading] = useState(true)
  const subjectPalette = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-violet-100 text-violet-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-cyan-100 text-cyan-700",
  "bg-sky-100 text-sky-700",
  "bg-teal-100 text-teal-700",
  "bg-slate-100 text-slate-700",
  "bg-gray-100 text-gray-700",
  "bg-neutral-100 text-neutral-700",
];
  const getSubjectColor = (subject: string) => {
  let hash = 0;

  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 🔥 better spread
  hash = hash ^ (hash >> 16);

  const index = Math.abs(hash) % subjectPalette.length;

  return subjectPalette[index];
};
  useEffect(()=>{
    fetchMaterials()
  },[])

  const fetchMaterials = async ()=>{
    try{
      const res = await axios.get(`${FILE_BASE}/api/materials/`)
      setMaterials(res.data)
    }catch(err){
      console.error("Material fetch failed",err)
    }finally{
      setLoading(false)
    }
  }

  return (

  <DashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">
      Study Material
    </h1>

    {/* CARD */}
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">

      {/* LOADING */}
      {loading && (
        <div className="p-10 text-center text-muted-foreground text-sm">
          Loading materials...
        </div>
      )}

      {/* EMPTY */}
      {!loading && materials.length === 0 && (
        <div className="p-10 text-center text-muted-foreground text-sm">
          No study materials available
        </div>
      )}

      {/* TABLE */}
      {!loading && materials.length > 0 && (

      <table className="w-full text-sm">

        <thead className="bg-secondary/50">
          <tr>
            {["Material","Course","Uploaded","Downloads","Actions"].map(h=>(
              <th key={h} className="text-left px-6 py-3 text-muted-foreground font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {materials.map((m)=>(

            <tr
              key={m.id}
              className="border-t border-border hover:bg-secondary/40 transition"
            >

              {/* TITLE */}
              <td className="px-6 py-4 flex items-center gap-3 font-medium text-foreground">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText size={16}/>
                </div>
                {m.title}
              </td>

              {/* COURSE */}
              <td className="px-6 py-4">
                <div className="flex flex-col">

  <span
  className={`px-3 py-1 text-xs rounded-full w-fit ${getSubjectColor(m.course_name)}`}
>
  {m.course_name}
</span>

  <span className="text-xs text-muted-foreground mt-1">
    {m.faculty_name}
  </span>

</div>
              </td>

              {/* DATE */}
              <td className="px-6 py-4 text-muted-foreground">
                {new Date(m.uploaded_at).toLocaleDateString("en-IN",{
                  day:"numeric",
                  month:"short",
                  year:"numeric"
                })}
              </td>

              {/* DOWNLOAD COUNT */}
              <td className="px-6 py-4 text-muted-foreground font-medium">
                {m.downloads}
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 flex gap-2">

                {/* PREVIEW */}
                <a
                  href={`${FILE_BASE}${m.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
                >
                  Preview
                </a>

                {/* DOWNLOAD */}
                <a
                  href={`${FILE_BASE}${m.file}`}
                  download
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                >
                  <Download size={14}/>
                  Download
                </a>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      )}

    </div>

  </DashboardLayout>

  )

}

export default StudyMaterial