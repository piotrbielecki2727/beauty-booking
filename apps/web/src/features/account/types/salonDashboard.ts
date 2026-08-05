type SalonDashboardMoneyMetric = {
  amount: number
  label: string
}

type SalonDashboardNumberMetric = {
  label: string
  value: number
}

type SalonDashboardTodayMetrics = {
  actualRevenue: SalonDashboardMoneyMetric
  completedVisits: SalonDashboardNumberMetric
  lostRevenue: SalonDashboardMoneyMetric
  predictedRevenue: SalonDashboardMoneyMetric
  remainingVisits: SalonDashboardNumberMetric
  visits: SalonDashboardNumberMetric
}

type SalonDashboardWeeklyStats = {
  occupancyRate: number
  popularServiceName: string
  revenue: number
  visits: number
}

type SalonDashboardMonthlyStats = {
  forecastRevenue: number
  revenue: number
}

type SalonDashboardSummary = {
  monthlyStats: SalonDashboardMonthlyStats
  todayMetrics: SalonDashboardTodayMetrics
  weeklyStats: SalonDashboardWeeklyStats
  workTimeTodayMinutes: number
}

export type {
  SalonDashboardMonthlyStats,
  SalonDashboardMoneyMetric,
  SalonDashboardNumberMetric,
  SalonDashboardSummary,
  SalonDashboardTodayMetrics,
  SalonDashboardWeeklyStats,
}
