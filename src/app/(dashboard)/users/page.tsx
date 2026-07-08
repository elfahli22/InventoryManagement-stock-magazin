import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "./_components/users-table";

interface UsersPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader title="Users" description="Manage system users and roles">
        <Button asChild>
          <Link href="/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </PageHeader>

      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <UsersTable page={Number(params.page) || 1} search={params.search} />
      </Suspense>
    </div>
  );
}
