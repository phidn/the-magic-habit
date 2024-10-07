import { StateCreator } from 'zustand'

export interface TRehydrateSlice {
  _hasHydrated: boolean
  setHasHydrated: (_hasHydrated: boolean) => void
}

export const rehydrateSlice: StateCreator<TRehydrateSlice> = (set) => ({
  _hasHydrated: false,
  setHasHydrated: (_hasHydrated: boolean) => set(() => ({ _hasHydrated })),
})
