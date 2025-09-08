import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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

  const getCookie = (name: string) => {
    const cookieString = document.cookie;
    if (!cookieString) return null;
    const cookies = cookieString.split(";").map(c => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/users/me/", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
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
      // Ensure CSRF exists
      await fetch("/api/users/csrf/", { credentials: "include" });
      // Logout
      const csrftoken = getCookie("csrftoken") || "";
      const res = await fetch("/api/users/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      if (!res.ok) return; // keep session if server rejected logout
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


