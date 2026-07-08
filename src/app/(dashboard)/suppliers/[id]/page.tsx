import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supplierService } from "@/lib/services/supplier.service";
import { formatDate } from "@/lib/utils/formatters";

interface SupplierDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  const { id } = await params;
  let result;

  try {
    result = await supplierService.getById(id);
  } catch {
    notFound();
  }

  const { supplier, products } = result;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/suppliers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{supplier.name}</h1>
            <p className="text-sm text-muted-foreground">{supplier.company || "Independent"}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/suppliers/${id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{supplier.email || "N/A"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm">{supplier.phone || "N/A"}</span>
            </div>
            {supplier.address && (
              <>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Address</span>
                  <p className="text-sm">
                    {supplier.address.street && <>{supplier.address.street}<br /></>}
                    {[supplier.address.city, supplier.address.state, supplier.address.zip]
                      .filter(Boolean)
                      .join(", ")}
                    {supplier.address.country && <><br />{supplier.address.country}</>}
                  </p>
                </div>
              </>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Added</span>
              <span className="text-sm">{formatDate(supplier.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {supplier.notes ? (
              <p className="text-sm text-muted-foreground">{supplier.notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No notes</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No products from this supplier</p>
          ) : (
            <div className="divide-y">
              {(products as Array<{ _id: string; name: string; sku: string; category: { name: string } | string }>).map((product) => (
                <div key={product._id} className="flex items-center gap-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${product._id}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                      {typeof product.category === "object" && product.category && (
                        <> — {(product.category as { name: string }).name}</>
                      )}
                    </p>
                  </div>
                  <Badge variant="success">
                    {supplier.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
