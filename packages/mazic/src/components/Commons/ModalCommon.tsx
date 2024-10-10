import {
  Button,
  ButtonLoading,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@mazic/ui'

import { useStoreShallow } from '@mazic/store/useStore'

export const ModalCommon = () => {
  const [modal, hideModal] = useStoreShallow((state) => [state.modal, state.hideModal])

  if (!modal.open) return null

  return (
    <Modal open={modal.open} onOpenChange={hideModal}>
      <ModalContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <ModalHeader>
          <ModalTitle>{modal.title}</ModalTitle>
          <ModalDescription>{modal.description}</ModalDescription>
        </ModalHeader>
        {modal.body}
        {modal.showFooter && (
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline" onClick={hideModal}>
                Close
              </Button>
            </ModalClose>
            {modal.showConfirm && (
              <ButtonLoading
                variant={modal.confirmVariant}
                onClick={modal.onConfirm}
                isLoading={modal.loadingConfirm}
              >
                {modal.confirmText || 'Continue'}
              </ButtonLoading>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}
