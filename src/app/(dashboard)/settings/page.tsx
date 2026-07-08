import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Manage your store settings" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <SettingsForm />
      </Suspense>
    </div>
  );
}
