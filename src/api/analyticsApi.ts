import apiClient from './client'

export interface PlatformSummary {
  totalMandis: number
  totalFarmers: number
  totalMandiOwners: number
  totalTransactions: number
  totalRevenue: number
  activeToday: number
}

export interface WeeklyAnalytics {
  day: string
  date: string
  revenue: number
  transactions: number
  farmers: number
}

export interface MonthlyAnalytics {
  month: string
  year: number
  revenue: number
  transactions: number
  farmers: number
}

export interface MandiRevenue {
  mandi_id: number
  mandi_name: string
  revenue: number
  farmers: number
  transactions: number
}

export interface CropDistribution {
  crop: string
  transactions: number
  revenue: number
  percentage: number
}

export async function getPlatformSummary(): Promise<PlatformSummary> {
  return apiClient<PlatformSummary>('/analytics/platform-summary')
}

export async function getWeeklyRevenue(): Promise<WeeklyAnalytics[]> {
  return apiClient<WeeklyAnalytics[]>('/analytics/weekly')
}

export async function getMonthlyRevenue(): Promise<MonthlyAnalytics[]> {
  return apiClient<MonthlyAnalytics[]>('/analytics/monthly')
}

export async function getMandiRevenue(): Promise<MandiRevenue[]> {
  return apiClient<MandiRevenue[]>('/analytics/mandi-revenue')
}

export async function getCropDistribution(): Promise<CropDistribution[]> {
  return apiClient<CropDistribution[]>('/analytics/crop-distribution')
}