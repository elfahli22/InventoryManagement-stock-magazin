import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackupList } from "./_components/backup-list";
import { CreateBackupButton } from "./_components/create-backup-button";

export default async function BackupPage() {
  return (
    <div>
      <PageHeader title="Backup & Restore" description="Manage database backups">
        <CreateBackupButton />
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64" />}>
            <BackupList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
