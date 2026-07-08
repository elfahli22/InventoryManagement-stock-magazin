"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createUserAction, updateUserAction } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  user?: Record<string, unknown>;
}

export function UserForm({ user }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!user;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const action = isEditing
      ? updateUserAction(user!._id as string, formData)
      : createUserAction(formData);

    const result = await action;

    if (result.success) {
      toast.success(isEditing ? "User updated" : "User created");
      router.push("/users");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save user");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user?.name as string}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email as string}
                required
                placeholder="john@example.com"
              />
            </div>
            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required={!isEditing}
                  placeholder="Min. 8 characters"
                  minLength={8}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select name="role" defaultValue={(user?.role as string) || "staff"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user?.phone as string}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="isActive">Active</Label>
                <Select name="isActive" defaultValue={String(user?.isActive ?? true)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? "Update User" : "Create User"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
