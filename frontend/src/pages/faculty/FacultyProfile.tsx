import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";

const FacultyProfile = () => (
  <FacultyDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">Profile</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">SW</div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Dr. Sarah Wilson</h2>
            <p className="text-sm text-muted-foreground">Associate Professor</p>
            <p className="text-xs text-muted-foreground">Faculty ID: FAC101</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Department", value: "Computer Science" },
            { label: "Email", value: "wilson@uni.edu" },
            { label: "Phone", value: "+91 98765 43210" },
            { label: "Office", value: "Room 305, CS Block" },
            { label: "Joining Date", value: "August 2018" },
            { label: "Specialization", value: "Data Structures & Algorithms" },
          ].map(f => (
            <div key={f.label} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="text-sm text-foreground">{f.value}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Edit Profile</button>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Current Password</label>
            <input type="password" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">New Password</label>
            <input type="password" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Confirm New Password</label>
            <input type="password" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Update Password</button>
        </div>
      </div>
    </div>
  </FacultyDashboardLayout>
);

export default FacultyProfile;
