import { ImmerStateCreator } from '@mazic/types/index'

export type DashboardTab = 'heatmap' | 'daily-checkin'

export interface IViewSlice {
  view: {
    dashboardActiveTab: DashboardTab
  }
  setDashboardActiveTab: (tab: DashboardTab) => void
}

export const viewSlice: ImmerStateCreator<IViewSlice> = (set) => ({
  view: {
    dashboardActiveTab: 'heatmap',
  },
  setDashboardActiveTab: (tab) =>
    set((state) => {
      state.view.dashboardActiveTab = tab
    }),
})
