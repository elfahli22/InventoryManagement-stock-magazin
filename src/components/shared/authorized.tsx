"use client";

import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";

export function ShowForNonDemo({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (user?.role === "demo") return null;
  return <>{children}</>;
}