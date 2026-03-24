import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface StudentProfile {
  id: number;
  name: string;
  usn: string;
  department: string;
  year: number;

  email: string;
  phone: string;
  address?: string;

  section?: string;
  cgpa?: string;
  skills?: string;
  interests?: string;

  linkedin?: string;
  github?: string;
}

const inputClass =
  "w-full px-2 py-1.5 rounded-md border border-border bg-background text-sm " +
  "focus:outline-none focus:ring-1 focus:ring-primary/30 transition";

const cardClass =
  "bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/student-profile/?username=${user?.username}`
      );
      setProfile(res.data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // 🔥 REUSABLE FIELD COMPONENT
  const renderField = (label: string, key: keyof StudentProfile, isTextarea = false) => (
    <div className="bg-muted/40 border border-border rounded-lg p-4 hover:bg-muted/60 transition">
      <p className="text-xs text-muted-foreground">{label}</p>

      {edit ? (
        isTextarea ? (
          <textarea
            value={(profile[key] as string) || ""}
            onChange={(e) =>
              setProfile({ ...profile, [key]: e.target.value })
            }
            className={inputClass + " mt-1 min-h-[60px] resize-none"}
          />
        ) : (
          <input
            value={(profile[key] as string) || ""}
            onChange={(e) =>
              setProfile({ ...profile, [key]: e.target.value })
            }
            className={inputClass + " mt-1"}
          />
        )
      ) : (
        <p className="text-sm font-medium text-foreground mt-1">
          {(profile[key] as string) || "-"}
        </p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-foreground mb-6">
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* LEFT PROFILE CARD */}
        <div className={cardClass + " self-start sticky top-6"}>

          <div className="flex flex-col items-center text-center">

            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 
            flex items-center justify-center text-primary text-2xl font-bold mb-3 shadow-inner">
              {initials}
            </div>

            <h2 className="text-lg font-semibold">{profile.name}</h2>

            <p className="text-sm text-muted-foreground">
              {profile.department}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              USN: {profile.usn}
            </p>

            <span className="mt-3 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
              Year {profile.year}
            </span>

          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="mt-6 w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium 
            hover:bg-primary/90 transition"
          >
            {edit ? "Cancel Editing" : "Edit Profile"}
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* BASIC INFO */}
          <div className={cardClass}>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Name", "name")}
              {renderField("USN", "usn")}
              {renderField("Department", "department")}
              {renderField("Year", "year")}
              {renderField("Section", "section")}
            </div>
          </div>

          {/* CONTACT */}
          <div className={cardClass}>
            <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Email", "email")}
              {renderField("Phone", "phone")}
              {renderField("Address", "address", true)}
            </div>
          </div>

          {/* ACADEMIC */}
          <div className={cardClass}>
            <h2 className="text-lg font-semibold mb-4">Academic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("CGPA", "cgpa")}
              {renderField("Skills", "skills", true)}
              {renderField("Interests", "interests", true)}
            </div>
          </div>

          {/* LINKS */}
          <div className={cardClass}>
            <h2 className="text-lg font-semibold mb-4">Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("LinkedIn", "linkedin")}
              {renderField("GitHub", "github")}
            </div>
          </div>

          {/* SAVE BUTTON */}
          {edit && (
            <button
              onClick={updateProfile}
              className="self-end px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium 
              hover:bg-primary/90 transition"
            >
              Save Changes
            </button>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;