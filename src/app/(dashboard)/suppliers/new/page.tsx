import { PageHeader } from "@/components/shared/page-header";
import { SupplierForm } from "@/components/forms/supplier-form";

export default function NewSupplierPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Add Supplier" description="Add a new supplier" />
      <SupplierForm />
    </div>
  );
}
