import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api/settings/";

const AdminSettings = () => {

  const [settings,setSettings] = useState<any>({
    institution_name:"",
    address:"",
    contact_email:"",
    phone:"",
    academic_year:"",
    semester:"",
    email_notifications:true,
    sms_alerts:true,
    weekly_reports:true
  });

  const fetchSettings = async () => {

    try{
      const res = await axios.get(API);
      setSettings(res.data);
    }
    catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchSettings();
  },[]);

  const handleChange = (e:any) => {

    const {name,value,type,checked} = e.target;

    setSettings({
      ...settings,
      [name]: type==="checkbox" ? checked : value
    });

  };

  const saveSettings = async () => {

    try{

      await axios.put(API,settings);

      alert("Settings saved");

    }
    catch(err){
      console.error(err);
    }

  };

  return (

  <AdminDashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="bg-card rounded-lg border border-border p-6">

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Institution Details
        </h2>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-muted-foreground">Institution Name</label>
            <input
              name="institution_name"
              value={settings.institution_name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Address</label>
            <input
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Contact Email</label>
            <input
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Phone</label>
            <input
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            />
          </div>

          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Save Changes
          </button>

        </div>

      </div>

      <div className="space-y-6">

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Academic Year
          </h2>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-muted-foreground">
                Current Academic Year
              </label>
              <input
                name="academic_year"
                value={settings.academic_year}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Current Semester
              </label>

              <select
                name="semester"
                value={settings.semester}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              >
                <option>Semester 1</option>
                <option>Semester 2</option>
              </select>

            </div>

            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              Update
            </button>

          </div>

        </div>

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Notifications
          </h2>

          <div className="space-y-3">

            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                name="email_notifications"
                checked={settings.email_notifications}
                onChange={handleChange}
                className="rounded border-border"
              />
              Email notifications for new registrations
            </label>

            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                name="sms_alerts"
                checked={settings.sms_alerts}
                onChange={handleChange}
                className="rounded border-border"
              />
              SMS alerts for low attendance
            </label>

            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                name="weekly_reports"
                checked={settings.weekly_reports}
                onChange={handleChange}
                className="rounded border-border"
              />
              Weekly report emails
            </label>

          </div>

        </div>

      </div>

    </div>

  </AdminDashboardLayout>

  );
};

export default AdminSettings;