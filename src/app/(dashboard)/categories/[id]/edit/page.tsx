import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "@/components/forms/category-form";
import { categoryService } from "@/lib/services/category.service";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  let category;
  try {
    category = await categoryService.getById(id);
  } catch {
    notFound();
  }

  const categories = await categoryService.list();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Category" description={`Editing ${(category as unknown as { name: string }).name}`} />
      <CategoryForm
        category={JSON.parse(JSON.stringify(category))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
