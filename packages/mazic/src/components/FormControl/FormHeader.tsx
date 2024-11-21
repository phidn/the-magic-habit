import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import { ChevronLeft } from 'lucide-react'

import { Button, ButtonLoading, cn } from '@mazic/ui'
import { PageDetails } from '@mazic/hooks/usePageDetails'

interface FormHeaderProps {
  pageDetails: PageDetails
  title?: string | React.ReactNode
  isPending?: boolean
  onBack?: () => void
  initialValues: any
  isValidForm?: boolean
}

export const FormHeader = (props: FormHeaderProps) => {
  const { onBack, isPending, isValidForm, title, initialValues, pageDetails } = props
  const methods = useFormContext()
  const navigate = useNavigate()
  const goBack = typeof onBack === 'function' ? onBack : () => navigate(-1)
  const isDirty = !isEqual(initialValues, methods.watch())

  const { isView } = pageDetails

  return (
    <div className="flex items-center gap-4 pb-4">
      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={goBack}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {title}
      </h1>
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
        <ButtonLoading
          size="sm"
          type="submit"
          isLoading={isPending}
          disabled={!isDirty || isPending || !isValidForm}
        >
          Save
        </ButtonLoading>
      </div>
      {isView && <div className="h-9"></div>}
    </div>
  )
}
