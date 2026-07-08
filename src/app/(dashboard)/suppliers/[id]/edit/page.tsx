import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierForm } from "@/components/forms/supplier-form";
import { supplierService } from "@/lib/services/supplier.service";

interface EditSupplierPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const { id } = await params;

  let result;
  try {
    result = await supplierService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Supplier" description={`Editing ${result.supplier.name}`} />
      <SupplierForm supplier={JSON.parse(JSON.stringify(result.supplier))} />
    </div>
  );
}
