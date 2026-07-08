import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { UserForm } from "@/components/forms/user-form";
import { userService } from "@/lib/services/user.service";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  let user;
  try {
    user = await userService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit User" description={`Editing ${user.name}`} />
      <UserForm user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
