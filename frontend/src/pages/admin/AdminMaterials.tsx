import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  id?: number;
  title: string;
  course: number;
  course_name?: string;
  file?: string;
  downloads: number;
}

const API = "http://127.0.0.1:8000/api/materials/";

const AdminMaterials = () => {

  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: undefined,
    title: "",
    course: 1,
    downloads: 0
  });

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(API);
      setMaterials(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAdd = () => {
    setEditing(false);
    setForm({
      id: undefined,
      title: "",
      course: 1,
      downloads: 0
    });
    setShowModal(true);
  };

  const openEdit = (m: Material) => {
    setEditing(true);
    setForm({
      id: m.id,
      title: m.title,
      course: m.course,
      downloads: m.downloads
    });
    setShowModal(true);
  };

  const saveMaterial = async () => {

    try {

      if (editing) {
        await axios.put(`${API}${form.id}/`, form);
      } else {
        await axios.post(API, form);
      }

      setShowModal(false);
      fetchMaterials();

    } catch (error) {
      console.error(error);
    }

  };

  const deleteMaterial = async (id?: number) => {

    if (!confirm("Delete this material?")) return;

    try {
      await axios.delete(`${API}${id}/`);
      fetchMaterials();
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Study Materials Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {[
          { label: "Total Materials", value: materials.length },
          { label: "Total Downloads", value: materials.reduce((a,b)=>a+b.downloads,0) },
          { label: "Storage Used", value: "—" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}

      </div>

      <div className="bg-card rounded-lg border border-border p-6">

        <div className="flex justify-between mb-4">

          <input
            placeholder="Search material..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border border-border px-3 py-2 rounded text-sm"
          />

          <button
            onClick={openAdd}
            className="bg-primary text-white px-4 py-2 rounded text-sm"
          >
            Add Material
          </button>

        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Uploaded Materials
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">

              {["Title","Course","Downloads","Actions"].map(h => (
                <th key={h} className="text-left py-2 text-muted-foreground font-medium">
                  {h}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {filteredMaterials.map(m => (

              <tr key={m.id} className="border-b border-border last:border-0">

                <td className="py-2.5 text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {m.title}
                </td>

                <td className="py-2.5 text-muted-foreground">
                  {m.course_name || m.course}
                </td>

                <td className="py-2.5 text-foreground">
                  {m.downloads}
                </td>

                <td className="py-2.5 flex gap-2">

                  <button
                    onClick={()=>openEdit(m)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteMaterial(m.id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Material" : "Add Material"}
            </h2>

            <div className="flex flex-col gap-3">

              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 rounded"/>
              <input name="course" placeholder="Course ID" value={form.course} onChange={handleChange} className="border p-2 rounded"/>
              <input name="downloads" placeholder="Downloads" value={form.downloads} onChange={handleChange} className="border p-2 rounded"/>

            </div>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={()=>setShowModal(false)}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveMaterial}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </AdminDashboardLayout>
  );
};

export default AdminMaterials;