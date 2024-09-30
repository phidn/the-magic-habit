import {
  Button,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@mazic-design-system'

import { useStoreShallow } from '@mazic/store/useStore'

export const ModalCommon = () => {
  const [modal, hideModal] = useStoreShallow((state) => [state.modal, state.hideModal])

  return (
    <Modal open={modal.open} onOpenChange={hideModal}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{modal.title}</ModalTitle>
          <ModalDescription>{modal.description}</ModalDescription>
        </ModalHeader>
        <ModalBody>{modal.body}</ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" onClick={hideModal}>
              Close
            </Button>
          </ModalClose>
          <Button variant="destructive" onClick={modal.onConfirm}>
            {modal.confirmText || 'Continue'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
