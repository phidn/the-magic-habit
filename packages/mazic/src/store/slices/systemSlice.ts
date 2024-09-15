import { ImmerStateCreator } from '@mazic/types/index'

type TAlert = {
  open: boolean
  title: string
  description: string
  onConfirm?: () => void
  loadingConfirm?: boolean
}

export type SystemSlice = {
  alert: TAlert
  setAlert: (alert: TAlert) => void
  hideAlert: () => void
  showAlertLoading: () => void
}

const systemSlice: ImmerStateCreator<SystemSlice> = (set) => ({
  alert: {
    open: false,
    title: '',
    description: '',
    onConfirm: () => null,
    loadingConfirm: false,
  },
  setAlert: (alert) =>
    set((state) => {
      state.alert = alert
    }),
  hideAlert: () =>
    set((state) => {
      state.alert.open = false
    }),
  showAlertLoading: () =>
    set((state) => {
      state.alert.loadingConfirm = true
    }),
  hideAlertLoading: () =>
    set((state) => {
      state.alert.loadingConfirm = true
    }),
})

export default systemSlice
