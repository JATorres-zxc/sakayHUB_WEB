import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Drivers from "./pages/Drivers";
import RidesDeliveries from "./pages/operations/RidesDeliveries";
import Financial from "./pages/operations/Financial";
import Support from "./pages/operations/Support";
import Communication from "./pages/Communication";
import System from "./pages/System";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/users" element={
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            } />
            <Route path="/drivers" element={
              <DashboardLayout>
                <Drivers />
              </DashboardLayout>
            } />
            <Route path="/operations/rides-deliveries" element={
              <DashboardLayout>
                <RidesDeliveries />
              </DashboardLayout>
            } />
            <Route path="/operations/financial" element={
              <DashboardLayout>
                <Financial />
              </DashboardLayout>
            } />
            <Route path="/operations/support" element={
              <DashboardLayout>
                <Support />
              </DashboardLayout>
            } />
            <Route path="/announcements" element={
              <DashboardLayout>
                <Communication />
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout>
                <System />
              </DashboardLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
