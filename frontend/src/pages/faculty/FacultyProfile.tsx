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

const API = "http://127.0.0.1:8000/api";
const inputClass =
  "w-full border border-border px-3 py-2.5 rounded-lg text-sm bg-background text-foreground " +
  "focus:outline-none focus:ring-2 focus:ring-primary/20 " +
  "hover:border-primary/40 transition";
const FacultyProfile = () => {

  const [profile, setProfile] = useState<FacultyProfileData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FacultyProfileData | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // 🔥 FETCH PROFILE + MERGE LOCAL DATA
  const fetchProfile = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;

      const res = await axios.get(
        `${API}/current-faculty/?username=${username}`
      );

      const extra = JSON.parse(
        localStorage.getItem("faculty_extra") || "{}"
      );

      const merged = {
        ...res.data,
        ...extra,
      };

      setProfile(merged);

      localStorage.setItem("faculty_id", res.data.id);
      localStorage.setItem("faculty_name", res.data.name);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 UPDATE
  const handleUpdate = async () => {
    try {
      if (!formData) return;

      // backend fields
      const payload = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        designation: formData.designation,
      };

      await axios.put(`${API}/faculty/${formData.id}/`, payload);

      // frontend fields
      const extra = {
        phone: formData.phone,
        office: formData.office,
        joining_date: formData.joining_date,
        specialization: formData.specialization,
      };

      localStorage.setItem("faculty_extra", JSON.stringify(extra));

      setShowModal(false);
      setSuccessMessage("Profile updated successfully");

      fetchProfile();

      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2);

  return (
    <FacultyDashboardLayout>

      <h1 className="text-3xl font-semibold text-foreground mb-6">
        My Profile
      </h1>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT CARD */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all">

          <div className="flex flex-col items-center text-center">

            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-3">
              {initials}
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              {profile.name}
            </h2>

            <p className="text-sm text-muted-foreground">
              {profile.designation}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              Faculty ID: FAC{profile.id}
            </p>

            <span className="mt-3 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {profile.department}
            </span>

          </div>

          <button
            onClick={() => {
              setFormData(profile);
              setShowModal(true);
            }}
            className="mt-6 w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            Edit Profile
          </button>

        </div>

        {/* RIGHT DETAILS */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {[
              { label: "Department", value: profile.department },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone || "-" },
              { label: "Office", value: profile.office || "-" },
              { label: "Joining Date", value: profile.joining_date || "-" },
              { label: "Specialization", value: profile.specialization || "-" },
            ].map(f => (
              <div key={f.label} className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm text-foreground mt-1">{f.value}</p>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showModal && formData && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[420px]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Edit Profile
        </h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-muted-foreground hover:text-foreground transition"
        >
          ✕
        </button>
      </div>

      {/* OPTIONAL ERROR (future-ready) */}
      {false && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          Error message here
        </div>
      )}

      {/* FORM */}
      <div className="flex flex-col gap-3">

  <input
    placeholder="Name"
    value={formData.name}
    onChange={(e) =>
      setFormData({ ...formData, name: e.target.value })
    }
    className={inputClass}
  />

  <select
    value={formData.department}
    onChange={(e) =>
      setFormData({ ...formData, department: e.target.value })
    }
    className={inputClass}
  >
    <option value="">Select Department</option>
    <option>ISE</option>
    <option>CSE</option>
    <option>ECE</option>
    <option>AI</option>
    <option>MECH</option>
  </select>

  <select
    value={formData.designation}
    onChange={(e) =>
      setFormData({ ...formData, designation: e.target.value })
    }
    className={inputClass}
  >
    <option value="">Select Designation</option>
    <option>Professor</option>
    <option>Associate Professor</option>
    <option>Assistant Professor</option>
    <option>Faculty</option>
  </select>

  <input
    placeholder="Email"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
    className={inputClass}
  />

  {/* 🔥 EXTRA FIELDS FIXED */}

  <input
    placeholder="Phone"
    value={formData.phone || ""}
    onChange={(e) =>
      setFormData({ ...formData, phone: e.target.value })
    }
    className={inputClass}
  />

  <input
    placeholder="Office"
    value={formData.office || ""}
    onChange={(e) =>
      setFormData({ ...formData, office: e.target.value })
    }
    className={inputClass}
  />

  <input
    type="date"
    value={formData.joining_date || ""}
    onChange={(e) =>
      setFormData({ ...formData, joining_date: e.target.value })
    }
    className={inputClass + " cursor-pointer"}
  />

  <input
    placeholder="Specialization"
    value={formData.specialization || ""}
    onChange={(e) =>
      setFormData({ ...formData, specialization: e.target.value })
    }
    className={inputClass}
  />

</div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/40 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

    </FacultyDashboardLayout>
  );
};

export default FacultyProfile;