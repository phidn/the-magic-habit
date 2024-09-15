import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckedState } from '@radix-ui/react-checkbox'

import { Checkbox, FormMessage } from '@mazic-design-system'

export interface FormCheckboxProps {
  field: string
  validation?: any
  title?: string
  disabled?: boolean
  afterChange?: (value: any) => void
}

const FormCheckbox = ({
  field,
  validation,
  title,
  disabled,
  afterChange,
  ...props
}: FormCheckboxProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const handleChange = (checked: CheckedState) => {
    methods.clearErrors(field)
    methods.setValue(field, checked)
    if (typeof afterChange === 'function') {
      afterChange?.(checked)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        disabled={disabled}
        checked={methods.watch(field)}
        onCheckedChange={handleChange}
        {...props}
      />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </label>
      {error && <FormMessage>{error?.message}</FormMessage>}
    </div>
  )
}

FormCheckbox.displayName = 'FormCheckbox'

export { FormCheckbox }
