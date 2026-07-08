import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign, Package } from "lucide-react";

const reportTypes = [
  {
    title: "Inventory Report",
    description: "Complete inventory overview with values and quantities",
    icon: Package,
    href: "/reports/inventory",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Sales Report",
    description: "Revenue, costs, and profit analysis",
    icon: TrendingUp,
    href: "/reports/sales",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Profit Report",
    description: "Gross profit margin and monthly trends",
    icon: DollarSign,
    href: "/reports/profit",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    title: "Low Stock Report",
    description: "Products that need reordering",
    icon: AlertTriangle,
    href: "/reports/low-stock",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Analyze your inventory data" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Link key={report.href} href={report.href}>
            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.color} mb-3`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
