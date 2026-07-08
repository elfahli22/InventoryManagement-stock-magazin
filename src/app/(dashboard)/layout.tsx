import { AuthProvider } from "@/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";

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
