import { categoryService } from "@/lib/services/category.service";
import { Category } from "@/types/category";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Tags, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteCategoryButton } from "./delete-category-button";
import { ShowForNonDemo } from "@/components/shared/authorized";

export async function CategoriesList() {
  const categories = await categoryService.list();

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<Tags className="h-8 w-8 text-muted-foreground" />}
        title="No categories yet"
        description="Create categories to organize your products"
        action={{ label: "Add Category", href: "/categories/new" }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(categories as unknown as Category[]).map((category) => (
        <Card key={category._id} className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Tags className="h-5 w-5 text-primary" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShowForNonDemo>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/categories/${category._id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteCategoryButton id={category._id} />
                </ShowForNonDemo>
              </div>
            </div>
            <h3 className="font-semibold mb-1">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {category.parent ? "Subcategory" : "Parent"}
              </Badge>
              {category.parent && (
                <span className="text-xs text-muted-foreground">
                  in {typeof category.parent === "object" ? (category.parent as { name: string }).name : ""}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
