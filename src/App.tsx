import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import StudentScan from "./pages/StudentScan.tsx";
import StudentPinVerify from "./pages/Studentpinverify.tsx";
import Attendance from "./pages/Attendance.tsx";
import Rooms from "./pages/Rooms.tsx";
import Analytics from "./pages/Analytics.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/scan" element={<StudentScan />} />
            <Route path="/student/pin" element={<StudentPinVerify />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;