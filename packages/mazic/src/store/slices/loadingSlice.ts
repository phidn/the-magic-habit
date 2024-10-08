import { ImmerStateCreator } from '@mazic/types/index'

export type TLoadingSlice = {
  loading: {
    isOpen: boolean
    setLoading: (isOpen: boolean) => void
    hideLoading: () => void
  }
}

export const loadingSlice: ImmerStateCreator<TLoadingSlice> = (set) => ({
  loading: {
    isOpen: false,
    setLoading: (isOpen) =>
      set((state) => {
        state.loading.isOpen = isOpen
      }),
    hideLoading: () =>
      set((state) => {
        state.loading.isOpen = false
      }),
  },
})
