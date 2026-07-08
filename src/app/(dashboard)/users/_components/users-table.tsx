import { userService } from "@/lib/services/user.service";
import { User } from "@/types/user";
import { formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Edit } from "lucide-react";

const roleColors: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
  super_admin: "destructive",
  admin: "warning",
  manager: "default",
  staff: "secondary",
};

interface UsersTableProps {
  page: number;
  search?: string;
}

export async function UsersTable({ page, search }: UsersTableProps) {
  const result = await userService.list({ page, limit: 20, search });

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8 text-muted-foreground" />}
        title="No users found"
        description="Add your first user"
        action={{ label: "Add User", href: "/users/new" }}
      />
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(result.data as unknown as User[]).map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{user.email}</TableCell>
              <TableCell>
                <Badge variant={roleColors[user.role] || "secondary"}>
                  {user.role.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusBadge status={String(user.isActive)} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.lastLogin ? formatDate(user.lastLogin, "relative") : "Never"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/users/${user._id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
