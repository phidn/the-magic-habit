import { ImmerStateCreator } from '@mazic/types/index'

type TModal = {
  open: boolean
  title: string
  description?: string
  body?: string | JSX.Element
  confirmText?: string
  onConfirm?: () => void
  loadingConfirm?: boolean
}

export type TSystemSlice = {
  modal: TModal
  showModal: (modal: Partial<TModal>) => void
  showModalDelete: (modal: Partial<TModal>) => void
  hideModal: () => void
  showModalLoading: () => void

  loading: {
    isOpen: boolean
    setLoading: (isOpen: boolean) => void
    hideLoading: () => void
  }
}

export const systemSlice: ImmerStateCreator<TSystemSlice> = (set) => ({
  modal: {
    open: false,
    title: '',
    description: '',
    body: '',
    onConfirm: () => null,
    loadingConfirm: false,
  },
  showModal: (modal) =>
    set((state) => {
      state.modal = { ...state.modal, ...modal, open: true }
    }),
  showModalDelete: (modal) =>
    set((state) => {
      state.modal = {
        ...state.modal,
        ...modal,
        open: true,
        title: 'Delete item',
        body: 'If you delete this item, it will be gone forever. Are you sure you want to delete it?',
        confirmText: 'Delete',
        onConfirm: () => {
          set((state) => {
            state.modal.loadingConfirm = true
          })
          modal.onConfirm?.()
        },
      }
    }),
  hideModal: () =>
    set((state) => {
      state.modal.open = false
      state.modal.loadingConfirm = false
    }),
  showModalLoading: () =>
    set((state) => {
      state.modal.loadingConfirm = true
    }),
  hideModalLoading: () =>
    set((state) => {
      state.modal.loadingConfirm = true
    }),

  loading: {
    isOpen: false,
    setLoading: (isOpen: boolean) =>
      set((state) => {
        state.loading.isOpen = isOpen
      }),
    hideLoading: () =>
      set((state) => {
        state.loading.isOpen = false
      }),
  },
})
