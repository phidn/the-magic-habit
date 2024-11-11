import { ImmerStateCreator } from '@mazic/types/index'

export type TLoadingSlice = {
  loading: {
    isOpen: boolean
    setLoading: (isOpen: boolean) => void
    hideLoading: () => void
  }
  loadingTop: {
    isOpen: boolean
    setLoading: (isOpen: boolean) => void
    hideLoading: () => void
    showLoading: () => void
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
  loadingTop: {
    isOpen: false,
    setLoading: (isOpen) =>
      set((state) => {
        state.loadingTop.isOpen = isOpen
      }),
    showLoading: () =>
      set((state) => {
        state.loadingTop.isOpen = true
      }),
    hideLoading: () =>
      set((state) => {
        state.loadingTop.isOpen = false
      }),
  },
})
