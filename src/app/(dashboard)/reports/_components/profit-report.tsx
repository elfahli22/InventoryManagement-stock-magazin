import { getProfitReportAction } from "@/lib/actions/report.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatters";

export async function ProfitReportView() {
  const result = await getProfitReportAction();

  if (!result.success) {
    return <p className="text-sm text-muted-foreground">Failed to load report</p>;
  }

  const report = result.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-sm text-muted-foreground">Gross Profit</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(report.grossProfit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Gross Margin</p>
            <p className="text-2xl font-bold">{formatPercentage(report.grossMargin)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Profit</CardTitle>
        </CardHeader>
        <CardContent>
          {report.monthlyProfit.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data</p>
          ) : (
            <div className="space-y-3">
              {report.monthlyProfit.map((m: { month: string; revenue: number; cost: number; profit: number }) => (
                <div key={m.month} className="flex items-center justify-between py-2 border-b last:border-0">
                  <p className="text-sm font-medium">{m.month}</p>
                  <div className="text-right">
                    <p className="text-sm">{formatCurrency(m.revenue)}</p>
                    <p className={`text-xs ${m.profit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {m.profit >= 0 ? "+" : ""}{formatCurrency(m.profit)}
                    </p>
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
