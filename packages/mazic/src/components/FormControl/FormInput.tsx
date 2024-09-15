import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormMessage, Input } from '@mazic-design-system'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string
  type?: React.HTMLInputTypeAttribute
  validation?: any
  placeholder?: string
  className?: string
  disabled?: boolean
  afterChange?: (value: any) => void
}

const FormInput = ({
  field,
  validation,
  type = 'text',
  placeholder,
  className,
  disabled,
  afterChange,
  ...props
}: FormInputProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.clearErrors(field)
    const _value = type === 'number' ? Number(e.target.value) : e.target.value
    methods.setValue(field, _value)
    if (typeof afterChange === 'function') {
      afterChange?.(_value)
    }
  }

  return (
    <Fragment>
      <Input
        type={type}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        value={methods.watch(field) ?? ''}
        name={field}
        onChange={handleChange}
        {...props}
      />
      {error && <FormMessage>{error?.message}</FormMessage>}
    </Fragment>
  )
}

FormInput.displayName = 'FormInput'

export { FormInput }
