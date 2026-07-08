"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CreateBackupButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success("Backup created");
        router.refresh();
      } else {
        toast.error(json.error?.message || "Failed to create backup");
      }
    } catch {
      toast.error("Failed to create backup");
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleCreate} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Shield className="h-4 w-4 mr-2" />
      )}
      Create Backup
    </Button>
  );
}
