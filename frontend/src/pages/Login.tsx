import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Mail, Lock } from "lucide-react";

const Login = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const { login } = useAuth();

const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password || loading) return;

  try {
    setLoading(true);
    await login(email, password);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

return ( <div className="min-h-screen flex bg-background">
{/* Left panel */} 
<div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col items-center justify-center p-12 text-primary-foreground"> <div className="absolute inset-0 bg-gradient-to-br from-primary to-[hsl(217,91%,45%)]" /> <div className="relative z-10 text-center max-w-md"> <GraduationCap className="h-20 w-20 mx-auto mb-8 opacity-90" /> <h1 className="text-4xl font-bold mb-4">EduTrack</h1> <p className="text-xl font-medium mb-2 opacity-90">
Student Management System </p> <p className="text-sm opacity-75 leading-relaxed mt-6">
A comprehensive platform for managing students, faculty, courses,
attendance, and academic performance — all in one place. </p>

      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-3xl font-bold font-mono-data">2,500+</p>
          <p className="text-xs opacity-75 mt-1">Students</p>
        </div>

        <div>
          <p className="text-3xl font-bold font-mono-data">150+</p>
          <p className="text-xs opacity-75 mt-1">Faculty</p>
        </div>

        <div>
          <p className="text-3xl font-bold font-mono-data">80+</p>
          <p className="text-xs opacity-75 mt-1">Courses</p>
        </div>
      </div>
    </div>
  </div>

  {/* Right panel */}
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="w-full max-w-md">

      <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-foreground">
          EduTrack
        </span>
      </div>

      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">

        <h2 className="text-2xl font-semibold text-foreground mb-1">
          Welcome back
        </h2>

        <p className="text-sm text-muted-foreground mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Username
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
>
  {loading ? "Signing in..." : "Sign In"}
</button>

        </form>

        <button className="w-full text-center text-sm text-primary hover:underline mt-4">
          Forgot Password?
        </button>

      </div>

      <p className="text-xs text-muted-foreground text-center mt-6">
        © 2026 EduTrack. All rights reserved.
      </p>

    </div>
  </div>
</div>


);
};

export default Login;
