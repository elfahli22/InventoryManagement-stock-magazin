import { productService } from "@/lib/services/product.service";
import { Product } from "@/types/product";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
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
import { Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsTableProps {
  page: number;
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
  order?: string;
}

export async function ProductsTable({ page, search, category, status, sort, order }: ProductsTableProps) {
  const result = await productService.list({
    page,
    limit: 20,
    sort: sort || "createdAt",
    order: (order as "asc" | "desc") || "desc",
    filters: {
      search,
      category,
      status: status as "active" | "inactive" | "discontinued" | undefined,
    },
  });

  if (result.data.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description={search ? "Try a different search term" : "Add your first product to get started"}
        action={{ label: "Add Product", href: "/products/new" }}
      />
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(result.data as unknown as Product[]).map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {product.image ? (
                      <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.barcode && (
                      <p className="text-xs text-muted-foreground">{product.barcode}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                  {product.sku}
                </code>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {typeof product.category === "object" ? product.category.name : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{formatCurrency(product.sellingPrice)}</p>
                  <p className="text-xs text-muted-foreground">
                    Cost: {formatCurrency(product.purchasePrice)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{product.quantity}</span>
                  {product.quantity <= product.minQuantity && (
                    <Badge variant="warning" className="text-[10px]">Low</Badge>
                  )}
                  {product.quantity === 0 && (
                    <Badge variant="destructive" className="text-[10px]">Out</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(product.createdAt)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/products/${product._id}`}>
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
