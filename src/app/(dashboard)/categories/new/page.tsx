import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "@/components/forms/category-form";
import { categoryService } from "@/lib/services/category.service";

export default async function NewCategoryPage() {
  const categories = await categoryService.list();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Add Category" description="Create a new product category" />
      <CategoryForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
