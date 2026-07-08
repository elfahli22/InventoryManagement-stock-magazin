import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "./_components/profile-form";

export default async function ProfilePage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" description="Manage your account settings" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <ProfileForm />
      </Suspense>
    </div>
  );
}
