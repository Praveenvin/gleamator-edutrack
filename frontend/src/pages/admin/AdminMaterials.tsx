import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Pencil, Trash2, Plus, X, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Material {
  id?: number;
  title: string;
  course: number;
  course_name?: string;
  file?: string;
}

interface Course {
  id:number;
  course_name:string;
}

const API = "http://127.0.0.1:8000/api/materials/";
const COURSE_API = "http://127.0.0.1:8000/api/courses/";
const FILE_BASE = "http://127.0.0.1:8000";

const AdminMaterials = ()=>{

const [materials,setMaterials] = useState<Material[]>([]);
const [courses,setCourses] = useState<Course[]>([]);
const [search,setSearch] = useState("");

const [showModal,setShowModal] = useState(false);
const [viewModal,setViewModal] = useState(false);

const [editingMaterial,setEditingMaterial] = useState<Material | null>(null);
const [selected,setSelected] = useState<Material | null>(null);

const [deleteId,setDeleteId] = useState<number | null>(null);

const [message,setMessage] = useState<string | null>(null);
const [formError,setFormError] = useState<string | null>(null);

const [selectedIds, setSelectedIds] = useState<number[]>([]);
const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
const [selectMode, setSelectMode] = useState(false);

const [file,setFile] = useState<File | null>(null);

const [form,setForm] = useState({
title:"",
course:1,
});

/* FETCH */

const fetchMaterials = async ()=>{
const res = await axios.get(API);
setMaterials(res.data);
};

const fetchCourses = async ()=>{
const res = await axios.get(COURSE_API);
setCourses(res.data);
};

useEffect(()=>{
fetchMaterials();
fetchCourses();
},[]);

/* FILTER */

const filtered = materials.filter(m =>
m.title.toLowerCase().includes(search.toLowerCase())
);

/* HANDLERS */

const handleChange = (e:any)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const openAdd = ()=>{
setEditingMaterial(null);
setFormError(null);
setFile(null);
setForm({title:"",course:1});
setShowModal(true);
};

const openEdit = (m:Material)=>{
setEditingMaterial(m);
setFormError(null);
setFile(null);
setForm({
title:m.title,
course:m.course
});
setShowModal(true);
};

/* SAVE */

const saveMaterial = async ()=>{

if(!form.title){
setFormError("All fields are required");
return;
}

try{

const formData = new FormData();

formData.append("title",form.title);
formData.append("course",String(form.course));

if(file){
formData.append("file",file);
}

if(editingMaterial){
await axios.put(`${API}${editingMaterial.id}/`,formData);
setMessage("Material updated successfully");
}else{
await axios.post(API,formData);
setMessage("Material added successfully");
}

setShowModal(false);
fetchMaterials();

}catch(err:any){
setFormError(err.response?.data?.error || "Error saving material");
}
};
  const toggleSelect = (id:number)=>{
  setSelectedIds(prev =>
    prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
  );
};

const toggleSelectAll = ()=>{
  if(selectedIds.length === filtered.length){
    setSelectedIds([]);
  } else {
    setSelectedIds(filtered.map(m => m.id as number));
  }
};

const confirmBulkDelete = async ()=>{
  try{
    await Promise.all(
      selectedIds.map(id => axios.delete(`${API}${id}/`))
    );

    setSelectedIds([]);
    setBulkDeleteMode(false);
    fetchMaterials();

    setMessage("Selected materials deleted successfully");

  }catch{
    setMessage("Error deleting selected materials");
  }
};
/* DELETE */

const confirmDelete = async ()=>{
if(!deleteId) return;

await axios.delete(`${API}${deleteId}/`);
setDeleteId(null);
fetchMaterials();
setMessage("Material deleted successfully");
};

return(

<AdminDashboardLayout>

<h1 className="text-2xl font-semibold text-foreground mb-6">
Study Materials Management
</h1>

{/* MESSAGE */}
{message && (
<div className="mb-4 px-4 py-2 rounded-lg text-sm flex justify-between items-center bg-green-100 text-green-700">
{message}
<button onClick={()=>setMessage(null)}>✕</button>
</div>
)}

{/* FILTER */}
<div className="flex flex-wrap items-center gap-4 mb-6">

<input
placeholder="Search materials..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border border-border px-4 py-2.5 rounded-lg text-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
/>
{!selectMode ? (
  <button
    onClick={()=>{
      setSelectMode(true);
      setSelectedIds([]);
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background hover:bg-primary/10"
  >
    Select
  </button>
) : (
  <button
    onClick={()=>{
      setSelectMode(false);
      setSelectedIds([]);
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-red-50 text-red-600"
  >
    Cancel Selection
  </button>
)}

{selectMode && selectedIds.length > 0 && (
  <button
    onClick={()=>setBulkDeleteMode(true)}
    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white"
  >
    Delete Selected ({selectedIds.length})
  </button>
)}
<button
onClick={openAdd}
className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition"
>
<Plus size={18}/>
Add Material
</button>

</div>

{/* TABLE */}
<div className="bg-card rounded-lg border border-border overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-secondary/50">
<tr>

  {selectMode && (
    <th className="px-4 py-3 text-center">
      <input
        type="checkbox"
        checked={selectedIds.length === filtered.length && filtered.length > 0}
        onChange={toggleSelectAll}
      />
    </th>
  )}

  {["Title","Course","File","Actions"].map(h=>(
<th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">
{h}
</th>
))}
</tr>
</thead>

<tbody>
  {filtered.length === 0 && (
  <tr>
    <td colSpan={selectMode ? 5 : 4} className="text-center py-4 text-muted-foreground">
      No materials found
    </td>
  </tr>
)}
{filtered.map(m=>(

<tr key={m.id} className={`border-t border-border hover:bg-secondary/40 transition ${
  selectedIds.includes(m.id || 0) ? "bg-blue-50" : ""
}`}>

{selectMode && (
  <td className="px-4 py-3 text-center">
    <input
      type="checkbox"
      checked={selectedIds.includes(m.id || 0)}
      onChange={()=>toggleSelect(m.id as number)}
    />
  </td>
)}

<td className="px-4 py-3 flex items-center gap-2 font-medium">
<FileText size={16}/>
{m.title}
</td>

<td className="px-4 py-3">
{m.course_name || m.course}
</td>

<td className="px-4 py-3">
{m.file && (
<button
onClick={()=>{
setSelected(m);
setViewModal(true);
}}
className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
>
View File
</button>
)}
</td>

<td className="px-4 py-3 flex gap-2">

<button
onClick={()=>openEdit(m)}
className="p-1.5 rounded text-blue-600 hover:bg-blue-100 transition"
>
<Pencil size={16}/>
</button>

<button
onClick={()=>setDeleteId(m.id || null)}
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

{/* VIEW MODAL */}
{viewModal && selected && (
<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

<div className="bg-white p-6 rounded-xl w-[520px] shadow-lg">

<div className="flex justify-between items-center mb-5">
<h2 className="text-lg font-semibold">Material Details</h2>
<button onClick={()=>setViewModal(false)}>
<X size={18}/>
</button>
</div>

<div className="space-y-4 text-sm">

<p><b>Title:</b> {selected.title}</p>
<p><b>Course:</b> {selected.course_name || selected.course}</p>

{selected.file && (
<div className="bg-secondary/40 border border-border rounded-lg p-4 flex justify-between items-center">

<div>
<p className="text-sm font-medium">Attachment</p>
<p className="text-xs text-muted-foreground">Preview or download</p>
</div>

<div className="flex gap-2">

<a
href={`${FILE_BASE}${selected.file}`}
target="_blank"
className="px-3 py-1.5 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20 transition"
>
Preview
</a>

<a
href={`${FILE_BASE}${selected.file}`}
download
className="px-3 py-1.5 text-xs rounded bg-primary text-white hover:bg-primary/90 transition"
>
Download
</a>

</div>

</div>
)}

</div>

<div className="flex justify-end mt-6">
<button
onClick={()=>setViewModal(false)}
className="px-4 py-2 border rounded-lg text-sm"
>
Close
</button>
</div>

</div>
</div>
)}

{/* ADD / EDIT MODAL */}
{showModal && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded-xl w-[420px]">

<div className="flex justify-between mb-4">
<h2 className="font-semibold">
{editingMaterial ? "Edit Material" : "Add Material"}
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

<input
name="title"
placeholder="Title"
value={form.title}
onChange={handleChange}
className="border px-3 py-2 rounded-lg text-sm"
/>

<select
name="course"
value={form.course}
onChange={handleChange}
className="border px-3 py-2 rounded-lg text-sm"
>
{courses.map(c=>(
<option key={c.id} value={c.id}>{c.course_name}</option>
))}
</select>

{/* UPLOAD UI */}
<div className="border border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition">

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
className="hidden"
id="upload"
/>

{!file ? (
<label htmlFor="upload" className="cursor-pointer flex flex-col items-center gap-3">

<div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
↑
</div>

<p className="text-sm">Upload file</p>

</label>
) : (
<div className="flex justify-between items-center bg-secondary/40 px-4 py-3 rounded-lg">

<div>
<p className="text-sm font-medium">{file.name}</p>
<p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB</p>
</div>

<div className="flex gap-2">

<button
onClick={()=>{
const url = URL.createObjectURL(file);
window.open(url);
}}
className="px-3 py-1 text-xs bg-primary/10 text-primary rounded"
>
Preview
</button>

<button
onClick={()=>setFile(null)}
className="px-3 py-1 text-xs text-red-600"
>
Remove
</button>

</div>

</div>
)}

</div>

</div>

<div className="flex justify-end gap-3 mt-5">
<button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">
Cancel
</button>

<button onClick={saveMaterial} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
Save
</button>
</div>

</div>
</div>
)}

{/* DELETE */}
{deleteId && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded-xl w-[320px] text-center">

<h2 className="font-semibold mb-2">Delete Material</h2>
<p className="text-sm text-muted-foreground mb-4">Are you sure?</p>

<div className="flex justify-center gap-4">

<button onClick={()=>setDeleteId(null)} className="px-4 py-2 border rounded-lg text-sm">
Cancel
</button>

<button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
Delete
</button>

</div>

</div>
</div>
)}
  {bulkDeleteMode && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[360px] text-center">

      <h2 className="text-lg font-semibold text-red-600 mb-2">
        Bulk Delete
      </h2>

      <p className="text-sm mb-4">
        Delete {selectedIds.length} materials?
      </p>

      <div className="flex justify-center gap-4">

        <button
          onClick={()=>setBulkDeleteMode(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={confirmBulkDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete All
        </button>

      </div>

    </div>

  </div>
)}
</AdminDashboardLayout>
);
};

export default AdminMaterials;