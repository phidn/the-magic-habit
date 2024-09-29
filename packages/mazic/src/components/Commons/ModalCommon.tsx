import { Loader2Icon } from '@mazic-design-system'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@mazic-design-system'

import { useStoreShallow } from '@mazic/store/useStore'

export const AlertDialogCommon = () => {
  const [alert, hideAlert] = useStoreShallow((state) => [state.alert, state.hideAlert])

  return (
    <AlertDialog open={alert.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert.title}</AlertDialogTitle>
          <AlertDialogDescription>{alert.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={hideAlert}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={alert.onConfirm}>
            {alert.loadingConfirm && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const ModalCommon = () => {
  const [modal, hideModal] = useStoreShallow((state) => [state.modal, state.hideModal])

  return (
    <AlertDialog open={modal.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modal.title}</AlertDialogTitle>
          <AlertDialogDescription>{modal.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={hideModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={modal.onConfirm}>
            {modal.loadingConfirm && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
