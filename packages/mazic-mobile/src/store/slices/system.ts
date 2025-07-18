import { ImmerStateCreator } from '@/types/types'

export interface RehydrateStorageSlice {
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export interface ThemeSlice {
  isDarkMode: boolean
  themeColor: string
  customColor: string
  toggleMode: () => void
  setThemeColor: (themeColor: string) => void
  setCustomColor: (customColor: string) => void
}

export interface NavigationSlice {
  bottomActiveTab: string
  setBottomActiveTab: (bottomActiveTab: string) => void
}

export const themeSlice: ImmerStateCreator<ThemeSlice> = (set) => ({
  isDarkMode: false,
  themeColor: 'blue',
  customColor: '',
  toggleMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }))
  },
  setThemeColor: (themeColor) => set({ themeColor }),
  setCustomColor: (customColor) => set({ customColor }),
})

export const rehydrateStorageSlice: ImmerStateCreator<RehydrateStorageSlice> = (set) => ({
  _hasHydrated: false,
  setHasHydrated: (state) => set({ _hasHydrated: state }),
})

export const navigationSlice: ImmerStateCreator<NavigationSlice> = (set) => ({
  bottomActiveTab: '',
  setBottomActiveTab: (bottomActiveTab) => set({ bottomActiveTab }),
})
