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

import { useStore } from '@mazic/store/useStore'

export const AlertDialogCommon = () => {
  const { alert, hideAlert } = useStore()
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
