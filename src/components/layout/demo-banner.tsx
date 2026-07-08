"use client";

import { useAuth } from "@/providers/auth-provider";
import { Eye } from "lucide-react";

export function DemoBanner() {
  const { user } = useAuth();

  if (user?.role !== "demo") return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
        <Eye className="h-4 w-4" />
        <span>Demo Mode &mdash; Read Only</span>
      </div>
    </div>
  );
}