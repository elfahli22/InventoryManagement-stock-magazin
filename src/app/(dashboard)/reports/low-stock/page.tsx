import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { LowStockReportView } from "../_components/low-stock-report";

export default async function LowStockReportPage() {
  return (
    <div>
      <PageHeader title="Low Stock Report" description="Products that need reordering" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <LowStockReportView />
      </Suspense>
    </div>
  );
}
