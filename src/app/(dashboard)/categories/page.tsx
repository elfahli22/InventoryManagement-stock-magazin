import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { CategoriesList } from "./_components/categories-list";
import { ShowForNonDemo } from "@/components/shared/authorized";

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader title="Categories" description="Organize your products into categories">
        <ShowForNonDemo>
          <Button asChild>
            <Link href="/categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          </Button>
        </ShowForNonDemo>
      </PageHeader>

      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
