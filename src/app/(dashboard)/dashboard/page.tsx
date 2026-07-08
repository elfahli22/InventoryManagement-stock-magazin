import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatsGrid } from "./_components/dashboard-stats-grid";
import { DashboardCharts } from "./_components/dashboard-charts";
import { RecentActivity } from "./_components/recent-activity";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your inventory
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStatsGrid />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <DashboardCharts />
        </Suspense>
      </div>

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <>
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </>
  );
}

function ActivitySkeleton() {
  return <Skeleton className="h-64 rounded-xl" />;
}
