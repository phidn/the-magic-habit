import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { format } from 'date-fns'

import {
  cn,
  Button,
  Calendar,
  CalendarIcon,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@mazic/design-system'

interface FormDatePickerProps {
  field: string
  validation?: any
  placeholder?: string
  disabled?: boolean
}

const FormDatePicker = ({ field, validation, placeholder, disabled }: FormDatePickerProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const date = methods.watch(field)

  return (
    <Fragment>
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>{placeholder || 'Pick a date'}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} initialFocus />
        </PopoverContent>
      </Popover>
      {error && <FormMessage>{error?.message}</FormMessage>}
    </Fragment>
  )
}

FormDatePicker.displayName = 'FormDatePicker'

export { FormDatePicker }
