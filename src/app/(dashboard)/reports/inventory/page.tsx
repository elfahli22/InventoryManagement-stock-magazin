import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryReportView } from "../_components/inventory-report";

export default async function InventoryReportPage() {
  return (
    <div>
      <PageHeader title="Inventory Report" description="Overview of your inventory" />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <InventoryReportView />
      </Suspense>
    </div>
  );
}
