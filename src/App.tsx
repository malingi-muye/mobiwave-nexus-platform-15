
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleBasedRoute } from "./components/auth/RoleBasedRoute";
import { AuthPage } from "./components/auth/AuthPage";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import DatabaseAdmin from "./pages/admin/DatabaseAdmin";
import Analytics from "./pages/admin/Analytics";
import RevenueReports from "./pages/admin/RevenueReports";
import SystemLogs from "./pages/admin/SystemLogs";
import Monitoring from "./pages/admin/Monitoring";
import NotFound from "./pages/NotFound";
import { BulkSMS } from "./components/messaging/BulkSMS";
import { USSDService } from "./components/services/USSDService";
import { VoiceService } from "./components/services/VoiceService";
import { AirtimeService } from "./components/services/AirtimeService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Client Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bulk-sms" 
              element={
                <ProtectedRoute>
                  <BulkSMS />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ussd" 
              element={
                <ProtectedRoute>
                  <USSDService />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/voice" 
              element={
                <ProtectedRoute>
                  <VoiceService />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/airtime" 
              element={
                <ProtectedRoute>
                  <AirtimeService />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Dashboard Routes - Require admin or super_admin role */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <AdminDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <UserManagement />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <SystemSettings />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/database" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <DatabaseAdmin />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <Analytics />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/revenue" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <RevenueReports />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/logs" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <SystemLogs />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/monitoring" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin', 'super_admin']} redirectTo="/dashboard">
                    <Monitoring />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect legacy routes to appropriate dashboards */}
            <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/client-dashboard" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
