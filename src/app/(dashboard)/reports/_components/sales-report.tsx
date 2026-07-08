import { getSalesReportAction } from "@/lib/actions/report.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils/formatters";

export async function SalesReportView() {
  const result = await getSalesReportAction();

  if (!result.success) {
    return <p className="text-sm text-muted-foreground">Failed to load report</p>;
  }

  const report = result.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold">{formatNumber(report.totalSales)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(report.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(report.totalCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Profit</p>
            <p className="text-2xl font-bold">{formatCurrency(report.totalProfit)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {report.periodSales.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No sales data</p>
          ) : (
            <div className="space-y-3">
              {report.periodSales.map((day: { date: string; revenue: number; cost: number; profit: number; count: number }) => (
                <div key={day.date} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{day.date}</p>
                    <p className="text-xs text-muted-foreground">{day.count} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(day.revenue)}</p>
                    <p className="text-xs text-emerald-600">+{formatCurrency(day.profit)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
