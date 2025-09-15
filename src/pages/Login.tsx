import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import apiClient from "@/lib/api";
import { isAxiosError } from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  // Redirects are handled by PublicOnly route guard now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1) Get CSRF token
      const { data: csrfData } = await apiClient.get("users/csrf/");
      const csrftoken = csrfData?.csrftoken || "";

      // 2) Perform login using session auth
      await apiClient.post(
        "users/login/",
        new URLSearchParams({ username, password }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded", "X-CSRFToken": csrftoken },
        }
      );

      // Refresh auth context so guards recognize authenticated state
      await refreshUser();
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      // Attempt to extract server error detail if available
      type ErrorResponse = { detail?: string };
      const detail = isAxiosError(err)
        ? (err.response?.data as ErrorResponse | undefined)?.detail
        : undefined;
      setError(detail ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access your SakayHUB dashboard
          </p>
        </div>

        {/* Test Credentials Card */}
        <Card className="border-dashed border-muted bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Test credentials for developers and viewers
              </p>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Username:</span> admin
                </div>
                <div className="text-sm">
                  <span className="font-medium">Password:</span> qweasd123
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setUsername("admin");
                  setPassword("qweasd123");
                }}
                className="w-full"
              >
                Auto-fill Credentials
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <LogIn className="w-4 h-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>SakayHUB CRM Dashboard</p>
          <p>Admin access only</p>
        </div>
      </div>
    </div>
  );
}