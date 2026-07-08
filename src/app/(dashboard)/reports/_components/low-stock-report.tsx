import { getLowStockReportAction } from "@/lib/actions/report.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function LowStockReportView() {
  const result = await getLowStockReportAction();

  if (!result.success) {
    return <p className="text-sm text-muted-foreground">Failed to load report</p>;
  }

  const report = result.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Products ({report.totalCount})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {report.products.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No low stock items
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.products.map((p: { _id: string; name: string; sku: string; category: string; supplier?: string; quantity: number; minQuantity: number }) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell className="text-sm">{p.supplier || "N/A"}</TableCell>
                  <TableCell>
                    <span className={`font-mono font-bold ${p.quantity === 0 ? "text-destructive" : "text-amber-600"}`}>
                      {p.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{p.minQuantity}</TableCell>
                  <TableCell>
                    <Badge variant={p.quantity === 0 ? "destructive" : "warning"}>
                      {p.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
