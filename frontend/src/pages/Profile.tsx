import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface StudentProfile {
  id: number;
  name: string;
  usn: string;
  department: string;
  email: string;
  phone: string;
  year: number;
}

const Profile = () => {

  const { user } = useAuth();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [edit, setEdit] = useState(false);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Fetch profile when user is available
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {

    if (!user) return;

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/api/student-profile/?username=${user.username}`
      );

      setProfile(res.data);

    }
    catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const updateProfile = async () => {

    if (!profile) return;

    try {

      await axios.put(
        `http://127.0.0.1:8000/api/students/${profile.id}/`,
        profile
      );

      setEdit(false);

    }
    catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const changePassword = async () => {

    if (!user) return;

    if (password.new !== password.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/change-password/",
        {
          username: user.username,
          current: password.current,
          new: password.new
        }
      );

      alert("Password updated");

      setPassword({
        current: "",
        new: "",
        confirm: ""
      });

    }
    catch (err) {
      console.error(err);
    }
  };

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (

    <DashboardLayout>

      <h1 className="text-2xl font-medium text-foreground mb-6">
        Profile & Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE */}

        <div className="bg-card rounded-lg border border-border p-6">

          <div className="flex items-center gap-4 mb-6">

            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
              {initials}
            </div>

            <div>

              <h2 className="text-lg font-medium text-foreground">
                {profile.name}
              </h2>

              <p className="text-sm text-muted-foreground">
                {profile.department} · Year {profile.year}
              </p>

              <p className="text-sm text-muted-foreground">
                USN: {profile.usn}
              </p>

            </div>

          </div>

          <div className="space-y-3">

            <div className="flex justify-between py-2 border-b border-border">

              <span className="text-sm text-muted-foreground">
                Email
              </span>

              {edit ? (

                <input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="border rounded px-2 text-sm"
                />

              ) : (

                <span className="text-sm text-foreground">
                  {profile.email}
                </span>

              )}

            </div>

            <div className="flex justify-between py-2 border-b border-border">

              <span className="text-sm text-muted-foreground">
                Phone
              </span>

              {edit ? (

                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="border rounded px-2 text-sm"
                />

              ) : (

                <span className="text-sm font-mono-data text-foreground">
                  {profile.phone}
                </span>

              )}

            </div>

          </div>

          {edit ? (

            <button
              onClick={updateProfile}
              className="mt-6 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Save Changes
            </button>

          ) : (

            <button
              onClick={() => setEdit(true)}
              className="mt-6 h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Edit Profile
            </button>

          )}

        </div>

        {/* PASSWORD */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Change Password
          </h2>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Current Password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-border bg-background"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-border bg-background"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-border bg-background"
            />

            <button
              onClick={changePassword}
              className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Update Password
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default Profile;