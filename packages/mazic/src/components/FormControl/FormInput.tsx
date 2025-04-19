import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormMessage, Input } from '@mazic/ui'

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
    let _value: any = e.target.value
    if (type === 'number') {
      if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
        _value = null
      } else {
        _value = Number(e.target.value)
      }
    }
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
