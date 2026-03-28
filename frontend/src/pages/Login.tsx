import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || loading) return;

    setErrorMessage("");

    try {
      setLoading(true);
      await login(username, password);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleShowPassword = () => {
  setShowPassword(true);

  setTimeout(() => {
    setShowPassword(false);
  }, 1000); // 1 second
};
  const handleForgot = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: email })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "User not found");
      return;
    }

    const token = data.reset_link.split("/").pop();

    setResetToken(token);
    setStep("reset");
    setMessage("");

  } catch {
    setMessage("Server error");
  }
};
  const handleResetPassword = async () => {
  try {
    await axios.post(
      `http://127.0.0.1:8000/api/reset-password/${resetToken}/`,
      { password: newPassword }
    );

    setMessage("Password updated successfully");

    setTimeout(() => {
      setShowForgot(false);
      setStep("email");
      setNewPassword("");
      setEmail("");
    }, 1500);

  } catch {
    setMessage("Invalid or expired link");
  }
};
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col items-center justify-center p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-[hsl(217,91%,45%)]" />
        <div className="relative z-10 text-center max-w-md">
          <GraduationCap className="h-20 w-20 mx-auto mb-8 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">EduTrack</h1>
          <p className="text-xl font-medium mb-2 opacity-90">
            Student Management System
          </p>
          <p className="text-sm opacity-75 leading-relaxed mt-6">
            Securely manage academic data, attendance, assignments, and performance
            with real-time insights and seamless user experience.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">EduTrack</span>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div>
  <label className="text-sm font-medium text-foreground block mb-1.5">
    Password
  </label>

  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full h-11 pl-10 pr-10 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      required
    />

    <button
      type="button"
      onClick={handleShowPassword}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>
</div>

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <button
              onClick={() => setShowForgot(true)}
              className="w-full text-center text-sm text-primary hover:underline mt-4"
            >
              Forgot Password?
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            © 2026 EduTrack. All rights reserved.
          </p>
        </div>
      </div>

      {showForgot && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-card border border-border rounded-2xl p-6 w-[380px] shadow-xl animate-in fade-in zoom-in">

      <h2 className="text-lg font-semibold text-foreground mb-1">
        Reset Password
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
  {step === "email"
    ? "Enter your username to receive a reset link"
    : "Enter your new password"}
</p>

      {step === "email" ? (
  <>
    <input
      type="text"
      placeholder="Username"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
    />

    <button
      onClick={handleForgot}
      className="w-full h-11 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
    >
      Send Reset Link
    </button>
  </>
) : (
  <>
    <input
      type="password"
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
    />

    <button
      onClick={handleResetPassword}
      className="w-full h-11 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
    >
      Update Password
    </button>
  </>
)}

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

      <button
        onClick={() => {
  setShowForgot(false);
  setStep("email");
  setMessage("");
}}
        className="text-xs mt-4 text-muted-foreground w-full text-center hover:underline"
      >
        Cancel
      </button>

    </div>

  </div>
)}
    </div>
  );
};

export default Login;