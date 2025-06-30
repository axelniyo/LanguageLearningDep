import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { AuthModal } from "@/components/AuthModal";
import { AdminPanel } from "@/components/AdminPanel";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { CourseLearning } from "@/components/CourseLearning";
import { LessonView } from "@/components/LessonView";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { useState } from "react";
import NotFound from "./pages/NotFound";
import LessonProgressDebugger from "@/pages/debug/LessonProgressDebugger";

const queryClient = new QueryClient();

const App = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Header openAuthModal={openAuthModal} />
              <Routes>
                <Route path="/" element={<HomePage openAuthModal={openAuthModal} />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/course/:courseId" element={<CourseLearning />} />
                <Route path="/lesson/:lessonId" element={<LessonView />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/debug/LessonProgressDebugger" element={<LessonProgressDebugger />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <AuthModal 
                isOpen={authModal.isOpen}
                onClose={closeAuthModal}
                mode={authModal.mode}
              />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;