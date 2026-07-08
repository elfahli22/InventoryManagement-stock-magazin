"use server";

import { reportService } from "@/lib/services/report.service";

export async function getInventoryReportAction() {
  try {
    const report = await reportService.getInventoryReport();
    return { success: true, data: JSON.parse(JSON.stringify(report)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to generate report" };
  }
}

export async function getSalesReportAction(startDate?: string, endDate?: string) {
  try {
    const report = await reportService.getSalesReport(startDate, endDate);
    return { success: true, data: JSON.parse(JSON.stringify(report)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to generate report" };
  }
}

export async function getLowStockReportAction() {
  try {
    const report = await reportService.getLowStockReport();
    return { success: true, data: JSON.parse(JSON.stringify(report)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to generate report" };
  }
}

export async function getProfitReportAction(startDate?: string, endDate?: string) {
  try {
    const report = await reportService.getProfitReport(startDate, endDate);
    return { success: true, data: JSON.parse(JSON.stringify(report)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to generate report" };
  }
}

export async function getMostSoldProductsAction(limit = 10) {
  try {
    const products = await reportService.getMostSoldProducts(limit);
    return { success: true, data: JSON.parse(JSON.stringify(products)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" };
  }
}
