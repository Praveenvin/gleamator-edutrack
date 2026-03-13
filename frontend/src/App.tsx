import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import Index from "./pages/Index";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import StudyMaterial from "./pages/StudyMaterial";
import Assignments from "./pages/Assignments";
import InternalMarks from "./pages/InternalMarks";
import LeaveRequests from "./pages/LeaveRequests";
import Messaging from "./pages/Messaging";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminGenericPage from "./pages/admin/AdminGenericPage";

import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyGenericPage from "./pages/faculty/FacultyGenericPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
<Route
  path="/"
  element={
    localStorage.getItem("user")
      ? <Navigate to="/admin-dashboard" replace />
      : <Navigate to="/login" replace />
  }
/>            <Route path="/login" element={<Login />} />

            {/* Student routes */}
            <Route path="/student-dashboard" element={<ProtectedRoute role="student"><Index /></ProtectedRoute>} />
            <Route path="/student-dashboard/attendance" element={<ProtectedRoute role="student"><Attendance /></ProtectedRoute>} />
            <Route path="/student-dashboard/timetable" element={<ProtectedRoute role="student"><Timetable /></ProtectedRoute>} />
            <Route path="/student-dashboard/study-material" element={<ProtectedRoute role="student"><StudyMaterial /></ProtectedRoute>} />
            <Route path="/student-dashboard/assignments" element={<ProtectedRoute role="student"><Assignments /></ProtectedRoute>} />
            <Route path="/student-dashboard/internal-marks" element={<ProtectedRoute role="student"><InternalMarks /></ProtectedRoute>} />
            <Route path="/student-dashboard/leave-requests" element={<ProtectedRoute role="student"><LeaveRequests /></ProtectedRoute>} />
            <Route path="/student-dashboard/messaging" element={<ProtectedRoute role="student"><Messaging /></ProtectedRoute>} />
            <Route path="/student-dashboard/reports" element={<ProtectedRoute role="student"><Reports /></ProtectedRoute>} />
            <Route path="/student-dashboard/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin-dashboard/faculty" element={<ProtectedRoute role="admin"><AdminFaculty /></ProtectedRoute>} />
            <Route path="/admin-dashboard/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin-dashboard/attendance" element={<ProtectedRoute role="admin"><AdminGenericPage title="Attendance Management" /></ProtectedRoute>} />
            <Route path="/admin-dashboard/assignments" element={<ProtectedRoute role="admin"><AdminGenericPage title="Assignments Management" /></ProtectedRoute>} />
            <Route path="/admin-dashboard/materials" element={<ProtectedRoute role="admin"><AdminGenericPage title="Study Materials Management" /></ProtectedRoute>} />
            <Route path="/admin-dashboard/reports" element={<ProtectedRoute role="admin"><AdminGenericPage title="Reports & Analytics" /></ProtectedRoute>} />
            <Route path="/admin-dashboard/settings" element={<ProtectedRoute role="admin"><AdminGenericPage title="Settings" /></ProtectedRoute>} />

            {/* Faculty routes */}
            <Route path="/faculty-dashboard" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/courses" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="My Courses" /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/attendance" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="Attendance" /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/assignments" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="Assignments" /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/materials" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="Upload Study Materials" /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/marks" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="Internal Marks" /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/messages" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="Messages" /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/profile" element={<ProtectedRoute role="faculty"><FacultyGenericPage title="Profile" /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
