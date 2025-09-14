import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCsrfToken = async (): Promise<string> => {
    try {
      const { data } = await apiClient.get("users/csrf/");
      return data?.csrftoken || "";
    } catch {
      return "";
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await apiClient.get("users/me/");
      if (data?.isAuthenticated) {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          is_staff: data.is_staff,
          is_superuser: data.is_superuser,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    try {
      const csrftoken = await fetchCsrfToken();
      await apiClient.post(
        "users/logout/",
        {},
        { headers: { "X-CSRFToken": csrftoken } }
      );
    } catch {
      // ignore
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


