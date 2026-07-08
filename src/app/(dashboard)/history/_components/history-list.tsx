import { historyService } from "@/lib/services/history.service";
import { InventoryHistory } from "@/types/history";
import { formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface HistoryListProps {
  page: number;
  action?: string;
  product?: string;
  startDate?: string;
  endDate?: string;
}

export async function HistoryList({ page, action, product, startDate, endDate }: HistoryListProps) {
  const result = await historyService.list({
    page,
    limit: 20,
    action,
    product,
    startDate,
    endDate,
  });

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="h-8 w-8 text-muted-foreground" />}
        title="No history found"
        description="Changes to inventory will appear here"
      />
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Changes</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(result.data as unknown as InventoryHistory[]).map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>
                <span className="font-medium">
                  {typeof entry.product === "object" ? entry.product.name : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={entry.action} />
              </TableCell>
              <TableCell>
                {entry.changes && Object.keys(entry.changes).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(entry.changes).slice(0, 2).map(([key, val]) => (
                      <Badge key={key} variant="secondary" className="text-[10px]">
                        {key}: {String(val.from)} → {String(val.to)}
                      </Badge>
                    ))}
                    {Object.keys(entry.changes).length > 2 && (
                      <Badge variant="secondary" className="text-[10px]">
                        +{Object.keys(entry.changes).length - 2} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {typeof entry.performedBy === "object" ? entry.performedBy.name : "System"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(entry.createdAt, "relative")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
