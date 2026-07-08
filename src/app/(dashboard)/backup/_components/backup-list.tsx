import { backupService } from "@/lib/services/backup.service";
import { formatDate } from "@/lib/utils/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Shield } from "lucide-react";

export async function BackupList() {
  const backups = await backupService.list();

  if (backups.length === 0) {
    return (
      <EmptyState
        icon={<Shield className="h-8 w-8 text-muted-foreground" />}
        title="No backups yet"
        description="Create your first backup to protect your data"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Filename</TableHead>
          <TableHead>Collections</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {backups.map((backup) => (
          <TableRow key={String(backup._id)}>
            <TableCell className="font-mono text-sm">{backup.filename}</TableCell>
            <TableCell className="text-sm">{backup.collections.join(", ")}</TableCell>
            <TableCell className="text-sm">
              {backup.size > 1024 ? `${(backup.size / 1024).toFixed(1)} KB` : `${backup.size} B`}
            </TableCell>
            <TableCell>
              <StatusBadge status={backup.status} />
            </TableCell>
            <TableCell className="text-sm">
              {typeof backup.createdBy === "object" && backup.createdBy !== null
                ? (backup.createdBy as { name: string }).name
                : "N/A"}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(backup.createdAt, "relative")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
