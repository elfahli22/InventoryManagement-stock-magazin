import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { SuppliersTable } from "./_components/suppliers-table";
import { ShowForNonDemo } from "@/components/shared/authorized";

interface SuppliersPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function SuppliersPage({ searchParams }: SuppliersPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader title="Suppliers" description="Manage your suppliers">
        <ShowForNonDemo>
          <Button asChild>
            <Link href="/suppliers/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Link>
          </Button>
        </ShowForNonDemo>
      </PageHeader>

      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <SuppliersTable
          page={Number(params.page) || 1}
          search={params.search}
        />
      </Suspense>
    </div>
  );
}
