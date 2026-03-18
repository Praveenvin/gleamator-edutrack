import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";

const SETTINGS_API = "http://127.0.0.1:8000/api/settings/";

const AdminSettings = () => {

  const { user } = useAuth();

  const [settings,setSettings] = useState<any>({});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  const [message,setMessage] = useState<string | null>(null);

  useEffect(()=>{
    fetchSettings();
  },[]);

  const fetchSettings = async () => {
    try{
      const res = await axios.get(SETTINGS_API);
      setSettings(res.data);
    }
    catch(err){
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  const handleChange = (e:any) => {
    const {name,value,type,checked} = e.target;

    setSettings({
      ...settings,
      [name]: type==="checkbox" ? checked : value
    });
  };

  const saveSettings = async () => {

    try{

      setSaving(true);

      await axios.put(SETTINGS_API,settings);

      setMessage("Settings updated successfully");

    }
    catch(err){

      console.error(err);
      setMessage("Failed to save settings");

    }
    finally{

      setSaving(false);

    }

  };

  if(loading){
    return(
      <AdminDashboardLayout>
        <div className="p-6 text-muted-foreground">
          Loading settings...
        </div>
      </AdminDashboardLayout>
    )
  }

  return(

  <AdminDashboardLayout>

  <h1 className="text-2xl font-semibold text-foreground mb-6">
    Settings
  </h1>

  {/* MESSAGE */}
  {message && (
    <div className={`mb-4 px-4 py-2 rounded-lg text-sm flex justify-between items-center ${
      message.includes("Failed")
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}>
      {message}
      <button onClick={()=>setMessage(null)}>
        <X size={16}/>
      </button>
    </div>
  )}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* PROFILE */}

    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition">

      <h2 className="text-lg font-semibold mb-4">
        Profile
      </h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm text-muted-foreground">
            Username
          </label>

          <input
            value={user?.username || ""}
            disabled
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-secondary/40 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">
            Role
          </label>

          <input
            value="Administrator"
            disabled
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-secondary/40 text-sm"
          />
        </div>

      </div>

    </div>

    {/* INSTITUTION DETAILS */}

    <div className="bg-card rounded-xl border border-border p-6 shadow-sm transition">

  <h2 className="text-lg font-semibold mb-4">
    Institution Details
  </h2>

  <div className="space-y-4">

    <input
      name="institution_name"
      value={settings.institution_name || ""}
      onChange={handleChange}
      placeholder="Institution Name"
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm 
      hover:border-primary/40 
      focus:outline-none focus:ring-2 focus:ring-primary/20 
      transition"
    />

    <input
      name="address"
      value={settings.address || ""}
      onChange={handleChange}
      placeholder="Address"
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm 
      hover:border-primary/40 
      focus:outline-none focus:ring-2 focus:ring-primary/20 
      transition"
    />

    <input
      name="contact_email"
      value={settings.contact_email || ""}
      onChange={handleChange}
      placeholder="Contact Email"
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm 
      hover:border-primary/40 
      focus:outline-none focus:ring-2 focus:ring-primary/20 
      transition"
    />

    <input
      name="phone"
      value={settings.phone || ""}
      onChange={handleChange}
      placeholder="Phone"
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm 
      hover:border-primary/40 
      focus:outline-none focus:ring-2 focus:ring-primary/20 
      transition"
    />

    <button
      onClick={saveSettings}
      disabled={saving}
      className="w-full px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium shadow hover:shadow-md hover:bg-primary/90 transition disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>

  </div>

</div>

  </div>

  </AdminDashboardLayout>

  );

};

export default AdminSettings;