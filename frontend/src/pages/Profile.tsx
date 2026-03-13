import { DashboardLayout } from "@/components/DashboardLayout";

const Profile = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Profile & Settings</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
            JS
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">John Smith</h2>
            <p className="text-sm text-muted-foreground">Computer Science · 3rd Year</p>
            <p className="text-sm text-muted-foreground">Roll No: CS2023042</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm text-foreground">john.smith@university.edu</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="text-sm font-mono-data text-foreground">+1 234 567 8900</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Date of Birth</span>
            <span className="text-sm font-mono-data text-foreground">2004-06-15</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Address</span>
            <span className="text-sm text-foreground">123 University Ave, Campus</span>
          </div>
        </div>
        <button className="mt-6 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-medium text-foreground mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Current Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">New Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Confirm Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Profile;
