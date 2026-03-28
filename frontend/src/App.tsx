import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ResetPassword from "@/pages/ResetPassword";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import StudyMaterial from "./pages/StudyMaterial";
import Assignments from "./pages/Assignments";
import InternalMarks from "./pages/InternalMarks";
import LeaveRequests from "./pages/LeaveRequests";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminLeave from "./pages/admin/AdminLeave";
import AdminSettings from "./pages/admin/AdminSettings";

import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyCourses from "./pages/faculty/FacultyCourses";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import FacultyMaterials from "./pages/faculty/FacultyMaterials";
import FacultyMarks from "./pages/faculty/FacultyMarks";
import FacultyLeave from "./pages/faculty/FacultyLeave";
import FacultyMessages from "./pages/faculty/FacultyMessages";
import FacultyProfile from "./pages/faculty/FacultyProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* Student routes */}
            <Route path="/student-dashboard" element={<ProtectedRoute role="student"><Index /></ProtectedRoute>} />
            <Route path="/student-dashboard/attendance" element={<ProtectedRoute role="student"><Attendance /></ProtectedRoute>} />
            <Route path="/student-dashboard/timetable" element={<ProtectedRoute role="student"><Timetable /></ProtectedRoute>} />
            <Route path="/student-dashboard/study-material" element={<ProtectedRoute role="student"><StudyMaterial /></ProtectedRoute>} />
            <Route path="/student-dashboard/assignments" element={<ProtectedRoute role="student"><Assignments /></ProtectedRoute>} />
            <Route path="/student-dashboard/internal-marks" element={<ProtectedRoute role="student"><InternalMarks /></ProtectedRoute>} />
            <Route path="/student-dashboard/leave-requests" element={<ProtectedRoute role="student"><LeaveRequests /></ProtectedRoute>} />
            <Route path="/student-dashboard/messaging" element={<ProtectedRoute role="student"><Messaging /></ProtectedRoute>} />
            <Route path="/student-dashboard/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin-dashboard/faculty" element={<ProtectedRoute role="admin"><AdminFaculty /></ProtectedRoute>} />
            <Route path="/admin-dashboard/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin-dashboard/attendance" element={<ProtectedRoute role="admin"><AdminAttendance /></ProtectedRoute>} />
            <Route path="/admin-dashboard/assignments" element={<ProtectedRoute role="admin"><AdminAssignments /></ProtectedRoute>} />
            <Route path="/admin-dashboard/materials" element={<ProtectedRoute role="admin"><AdminMaterials /></ProtectedRoute>} />
            <Route path="/admin-dashboard/leave" element={
  <ProtectedRoute role="admin">
    <AdminLeave />
  </ProtectedRoute>
} />
            <Route path="/admin-dashboard/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

            {/* Faculty routes */}
            <Route path="/faculty-dashboard" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/courses" element={<ProtectedRoute role="faculty"><FacultyCourses /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/attendance" element={<ProtectedRoute role="faculty"><FacultyAttendance /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/assignments" element={<ProtectedRoute role="faculty"><FacultyAssignments /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/leave" element={
  <ProtectedRoute role="faculty">
    <FacultyLeave />
  </ProtectedRoute>
} />
            <Route path="/faculty-dashboard/materials" element={<ProtectedRoute role="faculty"><FacultyMaterials /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/marks" element={<ProtectedRoute role="faculty"><FacultyMarks /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/messages" element={<ProtectedRoute role="faculty"><FacultyMessages /></ProtectedRoute>} />
            <Route path="/faculty-dashboard/profile" element={<ProtectedRoute role="faculty"><FacultyProfile /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
