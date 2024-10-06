import { Button, ButtonLink, EditIcon, TrashIcon, ViewIcon } from '@mazic/design-system'
interface ActionColumnProps {
  pathDetail?: string
  pathEdit?: string
  onDelete?: () => void
}

export const ActionColumn = (props: ActionColumnProps) => {
  const { pathDetail, pathEdit, onDelete } = props
  const isShowActions = {
    detail: typeof pathDetail === 'string',
    edit: typeof pathEdit === 'string',
    delete: typeof onDelete === 'function',
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {isShowActions.detail && (
        <ButtonLink variant="outline" className="hidden h-8 w-8 p-0 lg:flex" href={pathDetail}>
          <span className="sr-only">Detail</span>
          <ViewIcon className="h-4 w-4 text-primary" />
        </ButtonLink>
      )}
      {isShowActions.edit && (
        <ButtonLink variant="outline" className="hidden h-8 w-8 p-0 lg:flex" href={pathEdit}>
          <span className="sr-only">Edit</span>
          <EditIcon className="h-4 w-4 text-primary" />
        </ButtonLink>
      )}
      {isShowActions.delete && (
        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={onDelete}>
          <span className="sr-only">Delete</span>
          <TrashIcon className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  )
}
