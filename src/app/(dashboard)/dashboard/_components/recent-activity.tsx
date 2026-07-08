import { getRecentActivityAction } from "@/lib/actions/dashboard.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import { Package, ShoppingCart, AlertTriangle, RefreshCw, Trash2, Plus } from "lucide-react";

const actionIcons: Record<string, React.ReactNode> = {
  created: <Plus className="h-4 w-4" />,
  updated: <RefreshCw className="h-4 w-4" />,
  stock_in: <ShoppingCart className="h-4 w-4" />,
  stock_out: <Package className="h-4 w-4" />,
  adjustment: <AlertTriangle className="h-4 w-4" />,
  deleted: <Trash2 className="h-4 w-4" />,
};

export async function RecentActivity() {
  const result = await getRecentActivityAction(10);

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Failed to load activity</CardContent>
      </Card>
    );
  }

  const activities = result.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: { _id: string; action: string; description: string; userName: string; timestamp: string; productName: string }) => (
              <div
                key={activity._id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  {actionIcons[activity.action] || <RefreshCw className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.description || activity.productName || "Unknown activity"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.userName || "System"}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {formatDate(activity.timestamp, "relative")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
