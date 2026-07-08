import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productService } from "@/lib/services/product.service";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import { DeleteProductButton } from "../_components/delete-product-button";
import { ShowForNonDemo } from "@/components/shared/authorized";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  let product: any;

  try {
    product = await productService.getById(id);
  } catch {
    notFound();
  }

  const catName = typeof product.category === "object" && product.category !== null
    ? (product.category as { name: string }).name
    : "N/A";

  const supName = typeof product.supplier === "object" && product.supplier !== null
    ? (product.supplier as { name: string }).name
    : "None";

  const stockPercentage = product.minQuantity > 0
    ? Math.min(100, Math.round((product.quantity / product.minQuantity) * 100))
    : 100;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShowForNonDemo>
            <Button variant="outline" asChild>
              <Link href={`/products/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <DeleteProductButton id={id} />
          </ShowForNonDemo>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={product.status} />
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <span className="text-sm font-medium">{catName}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Supplier</span>
              <span className="text-sm font-medium">{supName}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Barcode</span>
              <span className="text-sm font-mono">{product.barcode || "N/A"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">{formatDate(product.createdAt, "long")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Purchase Price</span>
              <span className="text-sm font-medium">{formatCurrency(product.purchasePrice)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Selling Price</span>
              <span className="text-sm font-medium">{formatCurrency(product.sellingPrice)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Margin</span>
              <span className="text-sm font-medium text-emerald-600">
                {formatCurrency(product.sellingPrice - product.purchasePrice)}
              </span>
            </div>
            <Separator />
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Stock Level</span>
                <span className="text-sm font-medium">
                  {product.quantity} / {product.minQuantity} minimum
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stockPercentage <= 25
                      ? "bg-destructive"
                      : stockPercentage <= 50
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
            </div>
            {product.tags && product.tags.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {product.description && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
