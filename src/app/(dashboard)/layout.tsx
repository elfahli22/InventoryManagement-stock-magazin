import { AuthProvider } from "@/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppShell>
        <div className="page-container animate-fade-up">
          {children}
        </div>
      </AppShell>
    </AuthProvider>
  );
}
