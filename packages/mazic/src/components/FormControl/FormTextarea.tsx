import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormMessage, Textarea } from '@mazic-design-system'

interface FormTextareaProps {
  field: string
  validation?: any
  placeholder?: string
  className?: string
  disabled?: boolean
}

const FormTextarea = ({
  field,
  validation,
  placeholder,
  className,
  disabled,
  ...props
}: FormTextareaProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const handleChange = (e) => {
    methods.clearErrors(field)
    methods.setValue(field, e.target.value)
  }

  return (
    <Fragment>
      <Textarea
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        value={methods.watch(field) ?? ''}
        onChange={handleChange}
        {...props}
      />
      {error && <FormMessage>{error?.message}</FormMessage>}
    </Fragment>
  )
}

FormTextarea.displayName = 'FormTextarea'

export { FormTextarea }
