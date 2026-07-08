"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SettingsFormClientProps {
  settings: Record<string, unknown>;
}

export function SettingsFormClient({ settings }: SettingsFormClientProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const notifications = settings.notifications as { lowStock: boolean; dailyReport: boolean } || { lowStock: true, dailyReport: false };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("notifications.lowStock", String(formData.get("notifications.lowStock") === "on"));
    formData.set("notifications.dailyReport", String(formData.get("notifications.dailyReport") === "on"));

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: formData.get("storeName"),
          storeEmail: formData.get("storeEmail"),
          storePhone: formData.get("storePhone"),
          storeAddress: formData.get("storeAddress"),
          currency: formData.get("currency"),
          currencySymbol: formData.get("currencySymbol"),
          taxRate: Number(formData.get("taxRate")),
          lowStockThreshold: Number(formData.get("lowStockThreshold")),
          timezone: formData.get("timezone"),
          dateFormat: formData.get("dateFormat"),
          notifications: {
            lowStock: formData.get("notifications.lowStock") === "true",
            dailyReport: formData.get("notifications.dailyReport") === "true",
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Settings saved");
        router.refresh();
      } else {
        toast.error(json.error?.message || "Failed to save");
      }
    } catch {
      toast.error("Failed to save settings");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Store Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  defaultValue={settings.storeName as string}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  defaultValue={settings.storeEmail as string}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  name="storePhone"
                  defaultValue={settings.storePhone as string}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input
                  id="storeAddress"
                  name="storeAddress"
                  defaultValue={settings.storeAddress as string}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Regional</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  defaultValue={settings.currency as string || "USD"}
                  placeholder="USD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currencySymbol">Symbol</Label>
                <Input
                  id="currencySymbol"
                  name="currencySymbol"
                  defaultValue={settings.currencySymbol as string || "$"}
                  placeholder="$"
                  maxLength={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  defaultValue={settings.timezone as string || "UTC"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Input
                  id="dateFormat"
                  name="dateFormat"
                  defaultValue={settings.dateFormat as string || "MM/dd/yyyy"}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inventory</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  step="0.1"
                  defaultValue={settings.taxRate as number || 0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  defaultValue={settings.lowStockThreshold as number || 10}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lowStockNotify">Low Stock Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when stock is low</p>
                </div>
                <Switch
                  id="lowStockNotify"
                  name="notifications.lowStock"
                  defaultChecked={notifications.lowStock}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyReport">Daily Report</Label>
                  <p className="text-xs text-muted-foreground">Receive daily inventory summary</p>
                </div>
                <Switch
                  id="dailyReport"
                  name="notifications.dailyReport"
                  defaultChecked={notifications.dailyReport}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
