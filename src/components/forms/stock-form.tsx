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
import { stockInAction, stockOutAction, stockAdjustAction } from "@/lib/actions/stock.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface StockFormProps {
  type: "in" | "out" | "adjust";
  products: Array<{ _id: string; name: string; sku: string; quantity: number }>;
}

export function StockForm({ type, products }: StockFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const labels = {
    in: { title: "Stock In", quantityLabel: "Quantity to add", action: stockInAction },
    out: { title: "Stock Out", quantityLabel: "Quantity to remove", action: stockOutAction },
    adjust: { title: "Adjust", quantityLabel: "New quantity", action: stockAdjustAction },
  };

  const { quantityLabel, action } = labels[type];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result.success) {
      toast.success(`${labels[type].title} recorded successfully`);
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || `Failed to record ${labels[type].title}`);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Product</Label>
        <Select name="product" required>
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name} ({p.sku}) — Stock: {p.quantity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{quantityLabel} *</Label>
        <Input
          name="quantity"
          type="number"
          min={type === "adjust" ? 0 : 1}
          required
          placeholder={type === "adjust" ? "New quantity" : "Quantity"}
        />
      </div>

      <div className="space-y-2">
        <Label>Reference</Label>
        <Input name="reference" placeholder="Invoice / PO number" />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea name="notes" placeholder="Optional notes..." rows={2} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {labels[type].title}
      </Button>
    </form>
  );
}
