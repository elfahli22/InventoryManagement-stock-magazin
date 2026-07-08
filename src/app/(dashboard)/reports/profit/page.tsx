import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfitReportView } from "../_components/profit-report";

export default async function ProfitReportPage() {
  return (
    <div>
      <PageHeader title="Profit Report" description="Gross margin and profit analysis" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <ProfitReportView />
      </Suspense>
    </div>
  );
}
