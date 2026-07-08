import { getDashboardChartsAction } from "@/lib/actions/dashboard.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardAreaChart } from "./area-chart";
import { TopProductsChart } from "./top-products-chart";

export async function DashboardCharts() {
  const result = await getDashboardChartsAction();

  if (!result.success) {
    return (
      <>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Failed to load chart</CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Failed to load chart</CardContent>
        </Card>
      </>
    );
  }

  const { chartData, topProducts } = result.data || {};

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardAreaChart data={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <TopProductsChart data={topProducts} />
        </CardContent>
      </Card>
    </>
  );
}
