import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesReportView } from "../_components/sales-report";

export default async function SalesReportPage() {
  return (
    <div>
      <PageHeader title="Sales Report" description="Revenue and sales analysis" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <SalesReportView />
      </Suspense>
    </div>
  );
}
