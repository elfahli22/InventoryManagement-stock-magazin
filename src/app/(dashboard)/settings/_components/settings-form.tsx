import { settingsService } from "@/lib/services/settings.service";
import { SettingsFormClient } from "./settings-form-client";

export async function SettingsForm() {
  const settings = await settingsService.get();
  return <SettingsFormClient settings={JSON.parse(JSON.stringify(settings))} />;
}
