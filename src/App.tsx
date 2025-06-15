
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import BrowseTasks from "./pages/BrowseTasks";
import PostTask from "./pages/PostTask";
import Offers from "./pages/Offers";
import DemoOffers from "./pages/DemoOffers";
import MyAssignedTasks from "./pages/MyAssignedTasks";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<BrowseTasks />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/demo-offers" element={<DemoOffers />} />
            <Route 
              path="/post-task" 
              element={
                <ProtectedRoute>
                  <PostTask />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/offers" 
              element={
                <ProtectedRoute>
                  <Offers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assigned-tasks" 
              element={
                <ProtectedRoute>
                  <MyAssignedTasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
