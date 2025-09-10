import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalToastProvider } from "@/components/ui/universal-toast";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RidesDeliveries from "./pages/operations/RidesDeliveries";
import Financial from "./pages/operations/Financial";
import Support from "./pages/operations/Support";
import Communication from "./pages/Communication";
import System from "./pages/System";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { loading, user } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function PublicOnly({ children }: { children: JSX.Element }) {
  const { loading, user } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <UniversalToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<PublicOnly><Login /></PublicOnly>} />
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                <Route path="/users" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <UserManagement />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                <Route path="/operations/rides-deliveries" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <RidesDeliveries />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                <Route path="/operations/financial" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <Financial />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                <Route path="/operations/support" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <Support />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                <Route path="/announcements" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <Communication />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                <Route path="/settings" element={
                  <RequireAuth>
                    <DashboardLayout>
                      <System />
                    </DashboardLayout>
                  </RequireAuth>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </UniversalToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
