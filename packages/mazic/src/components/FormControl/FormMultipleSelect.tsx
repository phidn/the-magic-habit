import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormMessage, MultiSelect } from '@mazic/design-system'

import { IOption } from '@mazic/types/form'

interface FormMultipleSelectProps {
  field: string
  options: IOption[]
  onChange?: (value: any) => void
  validation?: any
  placeholder?: string
  className?: string
  disabled?: boolean
  maxCount?: number
}

const FormMultipleSelect = ({
  field,
  options,
  validation,
  placeholder,
  onChange,
  maxCount = 3,
  ...props
}: FormMultipleSelectProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const handleChange = (value: string[]) => {
    methods.clearErrors(field)
    methods.setValue(field, value)
  }

  return (
    <Fragment>
      <MultiSelect
        options={options}
        onValueChange={onChange || handleChange}
        values={methods.watch(field) || []}
        placeholder={placeholder || 'Select options...'}
        maxCount={maxCount}
        {...props}
      />
      {error && <FormMessage>{error?.message}</FormMessage>}
    </Fragment>
  )
}

FormMultipleSelect.displayName = 'FormMultipleSelect'

export { FormMultipleSelect }
