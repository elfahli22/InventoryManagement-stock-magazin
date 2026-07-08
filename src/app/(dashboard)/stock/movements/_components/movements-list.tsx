import { stockService } from "@/lib/services/stock.service";
import { StockMovement } from "@/types/stock";
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
import { ArrowRightLeft } from "lucide-react";

interface MovementsListProps {
  page: number;
  type?: string;
  product?: string;
  startDate?: string;
  endDate?: string;
}

export async function MovementsList({ page, type, product, startDate, endDate }: MovementsListProps) {
  const result = await stockService.getMovements({ page, limit: 20, type, product, startDate, endDate });

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon={<ArrowRightLeft className="h-8 w-8 text-muted-foreground" />}
        title="No movements found"
        description="Stock movements will appear here"
      />
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Previous</TableHead>
            <TableHead>New</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(result.data as unknown as StockMovement[]).map((movement) => (
            <TableRow key={movement._id}>
              <TableCell>
                <span className="font-medium">
                  {typeof movement.product === "object" ? movement.product.name : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={movement.type} />
              </TableCell>
              <TableCell>
                <span className={`font-mono font-medium ${movement.quantity < 0 ? "text-destructive" : "text-emerald-600"}`}>
                  {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">{movement.previousQuantity}</TableCell>
              <TableCell className="font-mono text-sm">{movement.newQuantity}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{movement.reference || "—"}</TableCell>
              <TableCell className="text-sm">
                {typeof movement.performedBy === "object" ? movement.performedBy.name : "N/A"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(movement.createdAt, "relative")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
