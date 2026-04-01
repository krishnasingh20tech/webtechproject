import { CONFIG } from "@/config";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRoles?: ("user" | "admin" | "superadmin")[];
};

const AuthGuard = ({ children, allowedRoles }: Props) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);

      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const profile = await res.json();
        setRole(profile?.user?.role || "user");
      } catch (err) {
        console.error("Backend fetch failed. Fallback to user role:", err);
        setRole("user"); // Fallback to avoid blank screen
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading || role === null) return null;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin tries to open /dashboard → send to /admin
  if (
    location.pathname === "/dashboard" &&
    (role === "admin" || role === "superadmin")
  ) {
    return <Navigate to="/admin" replace />;
  }

  // If normal user tries to open /admin → send to /dashboard
  if (location.pathname === "/admin" && role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  // If route has role restrictions
  if (allowedRoles && !allowedRoles.includes(role as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthGuard;
