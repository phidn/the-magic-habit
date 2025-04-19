import { TUser } from '@mazic/modules/rbac/user'
import { ImmerStateCreator } from '@mazic/types/index'
import { TMenuItem } from '@mazic/types/menu'

export type ChartType = 'bar' | 'line' | 'area'

export interface TUserSlice {
  sidebar: {
    isOpen: boolean
    openItem: TMenuItem
    toggle: () => void
    setOpenItem: (openItem: TMenuItem) => void
  }
  currentUser: {
    user?: TUser
    loaded: boolean
  }
  setCurrentUser: (user: TUser | undefined) => void
  chartType: ChartType
  setChartType: (chartType: ChartType) => void
}

export const userSlice: ImmerStateCreator<TUserSlice> = (set) => ({
  currentUser: {
    user: undefined,
    loaded: false,
  },
  sidebar: {
    isOpen: true,
    openItem: {
      label: '',
      href: '',
    },
    toggle: () => set((state) => void (state.sidebar.isOpen = !state.sidebar.isOpen)),
    setOpenItem: (openItem) => set((state) => void (state.sidebar.openItem = openItem)),
  },
  setCurrentUser: (user) =>
    set((state) => {
      state.currentUser.user = user
      state.currentUser.loaded = true
    }),
  chartType: 'bar',
  setChartType: (chartType) => set((state) => void (state.chartType = chartType)),
})
