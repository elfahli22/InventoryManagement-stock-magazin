import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { reportService } from "@/lib/services/report.service";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "inventory";
  const format = searchParams.get("format") || "json";

  let data: unknown;
  switch (type) {
    case "inventory":
      data = await reportService.getInventoryReport();
      break;
    case "sales":
      data = await reportService.getSalesReport(
        searchParams.get("startDate") || undefined,
        searchParams.get("endDate") || undefined,
      );
      break;
    case "low-stock":
      data = await reportService.getLowStockReport();
      break;
    case "profit":
      data = await reportService.getProfitReport(
        searchParams.get("startDate") || undefined,
        searchParams.get("endDate") || undefined,
      );
      break;
    default:
      data = await reportService.getInventoryReport();
  }

  if (format === "json") {
    return NextResponse.json({ success: true, data });
  }

  return NextResponse.json({ success: true, data });
}, { auth: true, roles: ["super_admin", "admin", "manager", "demo"] });
