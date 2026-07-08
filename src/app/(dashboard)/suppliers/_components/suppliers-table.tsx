import { supplierService } from "@/lib/services/supplier.service";
import { Supplier } from "@/types/supplier";
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
import Link from "next/link";
import { Truck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuppliersTableProps {
  page: number;
  search?: string;
}

export async function SuppliersTable({ page, search }: SuppliersTableProps) {
  const result = await supplierService.list({ page, limit: 20, search });

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon={<Truck className="h-8 w-8 text-muted-foreground" />}
        title="No suppliers found"
        description="Add your first supplier to get started"
        action={{ label: "Add Supplier", href: "/suppliers/new" }}
      />
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(result.data as unknown as Supplier[]).map((supplier) => (
            <TableRow key={supplier._id}>
              <TableCell>
                <span className="font-medium">{supplier.name}</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {supplier.company || "—"}
              </TableCell>
              <TableCell className="text-sm">{supplier.email || "—"}</TableCell>
              <TableCell className="text-sm">{supplier.phone || "—"}</TableCell>
              <TableCell>
                <span className="font-mono text-sm">{supplier.productCount}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={String(supplier.isActive)} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(supplier.createdAt)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/suppliers/${supplier._id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
