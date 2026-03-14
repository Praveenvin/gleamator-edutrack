import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface FacultyProfileData {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone?: string;
  office?: string;
  joining_date?: string;
  specialization?: string;
}

const API = "http://127.0.0.1:8000/api/faculty/profile/";

const FacultyProfile = () => {

  const [profile, setProfile] = useState<FacultyProfileData | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(API);
      setProfile(res.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0,2);

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE INFO */}

        <div className="bg-card rounded-lg border border-border p-6">

          <div className="flex items-center gap-4 mb-6">

            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {initials}
            </div>

            <div>

              <h2 className="text-lg font-semibold text-foreground">
                {profile.name}
              </h2>

              <p className="text-sm text-muted-foreground">
                {profile.designation}
              </p>

              <p className="text-xs text-muted-foreground">
                Faculty ID: FAC{profile.id}
              </p>

            </div>

          </div>

          <div className="space-y-3">

            {[
              { label: "Department", value: profile.department },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone || "-" },
              { label: "Office", value: profile.office || "-" },
              { label: "Joining Date", value: profile.joining_date || "-" },
              { label: "Specialization", value: profile.specialization || "-" },
            ].map(f => (

              <div
                key={f.label}
                className="flex justify-between py-2 border-b border-border last:border-0"
              >

                <span className="text-sm text-muted-foreground">
                  {f.label}
                </span>

                <span className="text-sm text-foreground">
                  {f.value}
                </span>

              </div>

            ))}

          </div>

          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Edit Profile
          </button>

        </div>

        {/* PASSWORD CHANGE */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Change Password
          </h2>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-muted-foreground">
                Current Password
              </label>

              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                New Password
              </label>

              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Confirm New Password
              </label>

              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              />
            </div>

            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
              Update Password
            </button>

          </div>

        </div>

      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyProfile;