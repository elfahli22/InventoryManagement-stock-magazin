"use server";

import { dashboardService } from "@/lib/services/dashboard.service";

export async function getDashboardStatsAction() {
  try {
    const stats = await dashboardService.getStats();
    return { success: true, data: JSON.parse(JSON.stringify(stats)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch stats" };
  }
}

export async function getDashboardChartsAction(days = 30) {
  try {
    const [chartData, topProducts, topCategories] = await Promise.all([
      dashboardService.getChartData(days),
      dashboardService.getTopProducts(5),
      dashboardService.getTopCategories(),
    ]);
    return {
      success: true,
      data: {
        chartData: JSON.parse(JSON.stringify(chartData)),
        topProducts: JSON.parse(JSON.stringify(topProducts)),
        topCategories: JSON.parse(JSON.stringify(topCategories)),
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch charts" };
  }
}

export async function getRecentActivityAction(limit = 10) {
  try {
    const activities = await dashboardService.getRecentActivity(limit);
    return { success: true, data: JSON.parse(JSON.stringify(activities)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch activities" };
  }
}
