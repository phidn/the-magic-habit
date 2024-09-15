import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import { ChevronLeft } from 'lucide-react'

import { Badge, BadgeProps, Button } from '@mazic-design-system'

import { PageDetails } from '@mazic/hooks/usePageDetails'
import { cn } from '@mazic/utils/cn'

export type TFormHeaderTitle = {
  text?: string
  variant?: BadgeProps['variant']
  hidden?: boolean
}
interface FormHeaderProps {
  pageDetails: PageDetails
  title?: string
  titleBadge?: TFormHeaderTitle
  isPending?: boolean
  onBack?: () => void
  initialValues: any
  isValidForm?: boolean
}

export const FormHeader = (props: FormHeaderProps) => {
  const { onBack, isPending, isValidForm, title, titleBadge, initialValues, pageDetails } = props
  const methods = useFormContext()
  const navigate = useNavigate()
  const goBack = typeof onBack === 'function' ? onBack : () => navigate(-1)
  const isDirty = !isEqual(initialValues, methods.watch())

  const { isAddView, isView } = pageDetails
  const _title = isAddView ? 'Add new' : `Edit ${title || ''}`

  return (
    <div className="flex items-center gap-4 pb-4">
      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={goBack}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {_title}
      </h1>
      {titleBadge && !titleBadge?.hidden && (
        <Badge variant={titleBadge?.variant || 'outline'} className="ml-auto sm:ml-0">
          {titleBadge?.text || ''}
        </Badge>
      )}
      <div className={cn('hidden items-center gap-2 md:ml-auto md:flex', isView && 'md:hidden')}>
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={!isDirty || isPending}
          onClick={() => methods.reset(initialValues)}
        >
          Reset
        </Button>
        <Button
          size="sm"
          type="submit"
          isLoading={isPending}
          disabled={!isDirty || isPending || !isValidForm}
        >
          Save
        </Button>
      </div>
      {isView && <div className="h-9"></div>}
    </div>
  )
}
