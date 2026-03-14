import { DashboardLayout } from "@/components/DashboardLayout";
import { Download } from "lucide-react";
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

const StudyMaterial = () => {

  const [materials,setMaterials] = useState<Material[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    fetchMaterials()
  },[])

  const fetchMaterials = async ()=>{

    try{

      const res = await axios.get(
        "http://127.0.0.1:8000/api/materials/"
      )

      setMaterials(res.data)

    }
    catch(err){
      console.error("Material fetch failed",err)
    }
    finally{
      setLoading(false)
    }

  }

  return (

  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Study Material
    </h1>

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      {loading && (
        <p className="p-6 text-muted-foreground">
          Loading materials...
        </p>
      )}

      {!loading && materials.length === 0 && (
        <p className="p-6 text-muted-foreground">
          No study materials uploaded yet
        </p>
      )}

      {materials.length > 0 && (

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b border-border bg-secondary/50">

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Title
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Course
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Uploaded
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Downloads
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {materials.map((m)=>(

            <tr key={m.id} className="border-b border-border hover:bg-secondary/30">

              <td className="px-6 py-4 text-foreground">
                {m.title}
              </td>

              <td className="px-6 py-4 text-muted-foreground">
                Course {m.course}
              </td>

              <td className="px-6 py-4 text-muted-foreground">
                {new Date(m.uploaded_at).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 text-muted-foreground">
                {m.downloads}
              </td>

              <td className="px-6 py-4">

                <a
                  href={`http://127.0.0.1:8000${m.file}`}
                  target="_blank"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Download className="h-4 w-4"/>
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