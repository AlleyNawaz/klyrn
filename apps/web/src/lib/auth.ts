"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "klyrn_auth";

export interface AuthUser {
  email: string;
  name: string;
  handle: string;
  avatar?: string;
}

/** Check if user is logged in */
export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { setUser(null); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && requireAuth) {
      router.replace("/login");
    }
  }, [loading, user, requireAuth, router]);

  return { user, loading, isAuthenticated: !!user };
}

/** Save user to localStorage on login */
export function loginUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

/** Clear user on logout */
export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}
