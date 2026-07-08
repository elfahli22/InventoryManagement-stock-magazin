import { authService } from "@/lib/services/auth.service";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ProfileFormClient } from "./profile-form-client";

export async function ProfileForm() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await authService.getCurrentUser(session.userId);
  return <ProfileFormClient user={JSON.parse(JSON.stringify(user))} />;
}
