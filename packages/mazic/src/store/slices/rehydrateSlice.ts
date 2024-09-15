import { StateCreator } from 'zustand'

export interface RehydrateSlice {
  _hasHydrated: boolean
  setHasHydrated: (_hasHydrated: boolean) => void
}

const rehydrateSlice: StateCreator<RehydrateSlice> = (set) => ({
  _hasHydrated: false,
  setHasHydrated: (_hasHydrated: boolean) => set(() => ({ _hasHydrated })),
})

export default rehydrateSlice
