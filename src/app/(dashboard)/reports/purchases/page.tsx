import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchasesReportPage() {
  return (
    <div>
      <PageHeader title="Purchase Report" description="Purchase history analysis" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Purchase report data will be available soon
        </div>
      </Suspense>
    </div>
  );
}
