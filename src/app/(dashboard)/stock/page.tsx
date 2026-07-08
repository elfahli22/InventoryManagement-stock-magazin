import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/forms/stock-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowForNonDemo } from "@/components/shared/authorized";

export default async function StockPage() {
  const { productService } = await import("@/lib/services/product.service");
  const products = await productService.list({ page: 1, limit: 100 });

  return (
    <div>
      <PageHeader title="Stock Management" description="Manage inventory stock levels" />

      <ShowForNonDemo>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Stock In</CardTitle>
            </CardHeader>
            <CardContent>
              <StockForm
                type="in"
                products={JSON.parse(JSON.stringify(products.data))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Out</CardTitle>
            </CardHeader>
            <CardContent>
              <StockForm
                type="out"
                products={JSON.parse(JSON.stringify(products.data))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adjust Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <StockForm
                type="adjust"
                products={JSON.parse(JSON.stringify(products.data))}
              />
            </CardContent>
          </Card>
        </div>
      </ShowForNonDemo>
    </div>
  );
}
