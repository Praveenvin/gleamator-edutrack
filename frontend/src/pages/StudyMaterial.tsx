import { DashboardLayout } from "@/components/DashboardLayout";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  id: number
  title: string
  course: number
  file: string
  uploaded_at: string
  downloads: number
}

const FILE_BASE = "http://127.0.0.1:8000";

const StudyMaterial = () => {

  const [materials,setMaterials] = useState<Material[]>([])
  const [loading,setLoading] = useState(true)

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
                <span className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground">
                  Course {m.course}
                </span>
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