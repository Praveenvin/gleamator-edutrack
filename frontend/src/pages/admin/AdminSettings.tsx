import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const AdminSettings = () => (
  <AdminDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Institution Details</h2>
        <div className="space-y-4">
          {[
            { label: "Institution Name", value: "National Institute of Technology" },
            { label: "Address", value: "Tech Road, Bangalore - 560001" },
            { label: "Contact Email", value: "admin@nit.edu" },
            { label: "Phone", value: "+91 80 2222 3333" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-sm text-muted-foreground">{f.label}</label>
              <input className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" defaultValue={f.value} />
            </div>
          ))}
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Save Changes</button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Academic Year</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Current Academic Year</label>
              <input className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" defaultValue="2024-2025" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Current Semester</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm">
                <option>Semester 1</option>
                <option selected>Semester 2</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Update</button>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
          <div className="space-y-3">
            {["Email notifications for new registrations", "SMS alerts for low attendance", "Weekly report emails"].map(n => (
              <label key={n} className="flex items-center gap-3 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="rounded border-border" />
                {n}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminDashboardLayout>
);

export default AdminSettings;
