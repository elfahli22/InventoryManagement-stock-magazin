"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/category.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  category?: { _id: string; name: string; description?: string; parent?: { _id: string } | string; sortOrder?: number };
  categories: Array<{ _id: string; name: string }>;
}

export function CategoryForm({ category, categories }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!category;

  const filteredCategories = categories.filter((c) => c._id !== category?._id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const action = isEditing
      ? updateCategoryAction(category._id, formData)
      : createCategoryAction(formData);

    const result = await action;

    if (result.success) {
      toast.success(isEditing ? "Category updated" : "Category created");
      router.push("/categories");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save category");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              required
              placeholder="e.g. Beverages"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description}
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category</Label>
            <Select
              name="parent"
              defaultValue={
                category?.parent
                  ? typeof category.parent === "object"
                    ? (category.parent as { _id: string })._id
                    : String(category.parent)
                  : ""
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None (top level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (top level)</SelectItem>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
