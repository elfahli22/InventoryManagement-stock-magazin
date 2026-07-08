import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ProductForm } from "@/components/forms/product-form";
import { productService } from "@/lib/services/product.service";
import { categoryService } from "@/lib/services/category.service";
import { supplierService } from "@/lib/services/supplier.service";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await productService.getById(id);
  } catch {
    notFound();
  }

  const [categories, suppliers] = await Promise.all([
    categoryService.list(),
    supplierService.getAll(),
  ]);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Product" description={`Editing ${(product as unknown as { name: string }).name}`} />
      <ProductForm
        product={JSON.parse(JSON.stringify(product))}
        categories={JSON.parse(JSON.stringify(categories))}
        suppliers={JSON.parse(JSON.stringify(suppliers))}
      />
    </div>
  );
}
