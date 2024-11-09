import { ImmerStateCreator } from '@/types/types'

export type TChart = '7d' | '1m' | '3m' | '1y' | 'all'

export interface ChartSlice {
  chartType: TChart
  setChartType: (chartType: TChart) => void
}

export const chartSlice: ImmerStateCreator<ChartSlice> = (set) => ({
  chartType: '1m',
  setChartType: (chartType: TChart) => set({ chartType }),
})
