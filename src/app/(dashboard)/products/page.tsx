import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { ProductsTable } from "./_components/products-table";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader title="Products" description="Manage your inventory products">
        <Button asChild>
          <Link href="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </PageHeader>

      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <ProductsTable
          page={Number(params.page) || 1}
          search={params.search}
          category={params.category}
          status={params.status}
          sort={params.sort}
          order={params.order}
        />
      </Suspense>
    </div>
  );
}
