import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { MovementsList } from "./_components/movements-list";

interface MovementsPageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    product?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function MovementsPage({ searchParams }: MovementsPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader title="Stock Movements" description="History of all stock changes" />

      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <MovementsList
          page={Number(params.page) || 1}
          type={params.type}
          product={params.product}
          startDate={params.startDate}
          endDate={params.endDate}
        />
      </Suspense>
    </div>
  );
}
