import { ImmerStateCreator } from '@mazic/types/index'

type TModal = {
  open: boolean
  title: string
  description: string
  onConfirm?: () => void
  loadingConfirm?: boolean
}

export type TSystemSlice = {
  alert: TModal
  setAlert: (alert: TModal) => void
  hideAlert: () => void
  showAlertLoading: () => void

  modal: TModal
  setModal: (modal: Partial<TModal>) => void
  hideModal: () => void
  showModalLoading: () => void
}

export const systemSlice: ImmerStateCreator<TSystemSlice> = (set) => ({
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

  modal: {
    open: false,
    title: '',
    description: '',
    onConfirm: () => null,
    loadingConfirm: false,
  },
  setModal: (modal) =>
    set((state) => {
      state.modal.open = !!modal.open
      state.modal.title = modal.title || ''
    }),
  hideModal: () =>
    set((state) => {
      state.modal.open = false
    }),
  showModalLoading: () =>
    set((state) => {
      state.modal.loadingConfirm = true
    }),
  hideModalLoading: () =>
    set((state) => {
      state.modal.loadingConfirm = true
    }),
})
