"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createSupplierAction, updateSupplierAction } from "@/lib/actions/supplier.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SupplierFormProps {
  supplier?: Record<string, unknown>;
}

export function SupplierForm({ supplier }: SupplierFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!supplier;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const action = isEditing
      ? updateSupplierAction(supplier!._id as string, formData)
      : createSupplierAction(formData);

    const result = await action;

    if (result.success) {
      toast.success(isEditing ? "Supplier updated" : "Supplier created");
      router.push("/suppliers");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save supplier");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={supplier?.name as string}
                required
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                defaultValue={supplier?.company as string}
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={supplier?.email as string}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={supplier?.phone as string}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                defaultValue={(supplier?.address as Record<string, string>)?.street || ""}
                placeholder="123 Main St"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                defaultValue={(supplier?.address as Record<string, string>)?.city || ""}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={(supplier?.address as Record<string, string>)?.state || ""}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                name="zip"
                defaultValue={(supplier?.address as Record<string, string>)?.zip || ""}
                placeholder="10001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={supplier?.notes as string}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? "Update Supplier" : "Create Supplier"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
