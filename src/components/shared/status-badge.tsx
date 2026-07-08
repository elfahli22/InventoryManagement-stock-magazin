import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/types/product";

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "default" }> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "secondary" },
  discontinued: { label: "Discontinued", variant: "destructive" },
  stock_in: { label: "Stock In", variant: "success" },
  stock_out: { label: "Stock Out", variant: "warning" },
  adjustment: { label: "Adjustment", variant: "default" },
  return: { label: "Return", variant: "secondary" },
  created: { label: "Created", variant: "success" },
  updated: { label: "Updated", variant: "default" },
  deleted: { label: "Deleted", variant: "destructive" },
  completed: { label: "Completed", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  in_progress: { label: "In Progress", variant: "warning" },
  low_stock: { label: "Low Stock", variant: "warning" },
  out_of_stock: { label: "Out of Stock", variant: "destructive" },
  in_stock: { label: "In Stock", variant: "success" },
  true: { label: "Active", variant: "success" },
  false: { label: "Inactive", variant: "secondary" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "default" as const };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
