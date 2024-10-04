import { TButtonVariant } from '@mazic-design-system'

import { ImmerStateCreator } from '@mazic/types/index'

type TModal = {
  open: boolean
  title: string
  description?: string
  body?: string | JSX.Element
  confirmVariant?: TButtonVariant
  confirmText?: string
  onConfirm?: () => void
  loadingConfirm?: boolean
  showFooter?: boolean
}

export type TModalSlice = {
  modal: TModal
  showModal: (modal: Partial<TModal>) => void
  showModalDelete: (modal: Partial<TModal>) => void
  showModalBulkDelete: (modal: Partial<TModal>) => void
  hideModal: () => void
  showModalLoading: () => void
}

const initModal: TModal = {
  open: false,
  title: '',
  description: '',
  body: '',
  confirmVariant: 'default',
  onConfirm: () => null,
  loadingConfirm: false,
  showFooter: true,
}

export const modalSlice: ImmerStateCreator<TModalSlice> = (set) => ({
  modal: initModal,
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
        confirmVariant: 'destructive',
        onConfirm: () => {
          set((state) => {
            state.modal.loadingConfirm = true
          })
          modal.onConfirm?.()
        },
      }
    }),
  showModalBulkDelete: (modal) =>
    set((state) => {
      state.modal = {
        ...state.modal,
        ...modal,
        open: true,
        title: 'Delete items',
        body: 'If you delete these items, they will be gone forever. Are you sure you want to delete them?',
        confirmText: 'Delete',
        confirmVariant: 'destructive',
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
      state.modal = initModal
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
