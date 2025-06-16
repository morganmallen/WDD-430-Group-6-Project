"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isLoggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth status..."); // Debug log
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include", // Important for cookies
        });
        const data = await response.json();
        console.log("Auth check response:", data); // Debug log

        if (data.success && data.name) {
          console.log("Auth successful, setting user:", data.name); // Debug log
          setIsLoggedIn(true);
          setUserName(data.name);
        } else {
          console.log("Auth failed:", data.message); // Debug log
          setIsLoggedIn(false);
          setUserName(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
        setUserName(null);
      }
    };

    checkAuth();
  }, []);

  const login = (name: string) => {
    console.log("Setting login state for:", name); // Debug log
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = async () => {
    console.log("Logout attempt"); // Debug log
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      });
      const data = await response.json();
      console.log("Logout response:", data); // Debug log

      setIsLoggedIn(false);
      setUserName(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
