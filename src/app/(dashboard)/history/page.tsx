import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryList } from "./_components/history-list";

interface HistoryPageProps {
  searchParams: Promise<{
    page?: string;
    action?: string;
    product?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader
        title="Inventory History"
        description="Complete audit trail of all changes"
      />

      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <HistoryList
          page={Number(params.page) || 1}
          action={params.action}
          product={params.product}
          startDate={params.startDate}
          endDate={params.endDate}
        />
      </Suspense>
    </div>
  );
}
