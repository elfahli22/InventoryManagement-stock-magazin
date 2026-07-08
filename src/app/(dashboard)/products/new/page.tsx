import { PageHeader } from "@/components/shared/page-header";
import { ProductForm } from "@/components/forms/product-form";

export default async function NewProductPage() {
  const { categoryService } = await import("@/lib/services/category.service");
  const { supplierService } = await import("@/lib/services/supplier.service");

  const [categories, suppliers] = await Promise.all([
    categoryService.list(),
    supplierService.getAll(),
  ]);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Add Product" description="Create a new product in your inventory" />
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        suppliers={JSON.parse(JSON.stringify(suppliers))}
      />
    </div>
  );
}
