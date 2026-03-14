import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const SETTINGS_API = "http://127.0.0.1:8000/api/settings/";

const AdminSettings = () => {

  const { user } = useAuth();

  const [settings,setSettings] = useState<any>({});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

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

      alert("Settings saved successfully");

    }
    catch(err){

      console.error(err);
      alert("Failed to save settings");

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

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* ADMIN ACCOUNT */}

    <div className="bg-card rounded-lg border border-border p-6">

      <h2 className="text-lg font-semibold text-foreground mb-4">
        Admin Account
      </h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm text-muted-foreground">
            Username
          </label>

          <input
            value={user?.username || ""}
            disabled
            className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">
            Role
          </label>

          <input
            value="Administrator"
            disabled
            className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
          />
        </div>

        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Change Password
        </button>

      </div>

    </div>

    {/* INSTITUTION DETAILS */}

    <div className="bg-card rounded-lg border border-border p-6">

      <h2 className="text-lg font-semibold text-foreground mb-4">
        Institution Details
      </h2>

      <div className="space-y-4">

        <input
          name="institution_name"
          value={settings.institution_name || ""}
          onChange={handleChange}
          placeholder="Institution Name"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        />

        <input
          name="address"
          value={settings.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        />

        <input
          name="contact_email"
          value={settings.contact_email || ""}
          onChange={handleChange}
          placeholder="Contact Email"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        />

        <input
          name="phone"
          value={settings.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        />

        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>

    {/* ACADEMIC SETTINGS */}

    <div className="bg-card rounded-lg border border-border p-6">

      <h2 className="text-lg font-semibold text-foreground mb-4">
        Academic Settings
      </h2>

      <div className="space-y-4">

        <input
          name="academic_year"
          value={settings.academic_year || ""}
          onChange={handleChange}
          placeholder="Academic Year"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        />

        <select
          name="semester"
          value={settings.semester || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option>Semester 1</option>
          <option>Semester 2</option>
        </select>

      </div>

    </div>

    {/* NOTIFICATIONS */}

    <div className="bg-card rounded-lg border border-border p-6">

      <h2 className="text-lg font-semibold text-foreground mb-4">
        Notifications
      </h2>

      <div className="space-y-3">

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            name="email_notifications"
            checked={settings.email_notifications || false}
            onChange={handleChange}
          />
          Email notifications
        </label>

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            name="sms_alerts"
            checked={settings.sms_alerts || false}
            onChange={handleChange}
          />
          SMS alerts
        </label>

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            name="weekly_reports"
            checked={settings.weekly_reports || false}
            onChange={handleChange}
          />
          Weekly reports
        </label>

      </div>

    </div>

  </div>

  </AdminDashboardLayout>

  );

};

export default AdminSettings;