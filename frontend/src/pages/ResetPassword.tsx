import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {

  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleReset = async () => {
  try {
    await axios.post(
      `http://127.0.0.1:8000/api/reset-password/${token}/`,
      { password }
    );

    setMessage("Password updated successfully. Redirecting to login...");

    // ⏳ Wait 1.5 sec then redirect
    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch {
    setMessage("Invalid or expired reset link. Please try again.");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="bg-card border border-border p-6 rounded-xl w-[350px]">

        <h2 className="text-lg font-semibold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border border-input px-3 py-2 rounded mb-3"
        />

        <button
          onClick={handleReset}
          className="w-full bg-primary text-white py-2 rounded-md"
        >
          Update Password
        </button>

        {message && (
          <p
  className={`text-sm mt-3 text-center ${
    message.toLowerCase().includes("success")
      ? "text-green-500"
      : "text-red-500"
  }`}
>
  {message}
</p>
        )}

      </div>

    </div>
  );
};

export default ResetPassword;