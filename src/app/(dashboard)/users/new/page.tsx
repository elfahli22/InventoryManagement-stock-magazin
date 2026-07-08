import { PageHeader } from "@/components/shared/page-header";
import { UserForm } from "@/components/forms/user-form";

export default function NewUserPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Add User" description="Create a new user account" />
      <UserForm />
    </div>
  );
}
