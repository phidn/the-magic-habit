import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mazic-design-system'

interface FormSelectProps {
  field: string
  fieldDeps?: [string, string][]
  options: {
    label: string
    value: string
    disabled?: boolean
    [key: string]: any
  }[]
  onChange?: (value: any) => void
  type?: string
  validation?: any
  placeholder?: string
  className?: string
  disabled?: boolean
}

const FormSelect = ({
  field,
  options,
  validation,
  placeholder,
  onChange,
  fieldDeps = [],
  ...props
}: FormSelectProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const handleChange = (value: string) => {
    methods.clearErrors(field)
    methods.setValue(field, value)
    if (fieldDeps?.length) {
      const selectedOption = options.find((opt) => opt.value === value)
      fieldDeps.forEach((dep) => {
        const [depField, depKey] = dep
        methods.setValue(depField, selectedOption?.[depKey])
      })
    }
  }

  return (
    <Fragment>
      <Select
        onValueChange={onChange || handleChange}
        value={methods.watch(field) || ''}
        {...props}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt, index: number) => (
            <SelectItem value={opt.value} disabled={opt?.disabled} key={index}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FormMessage>{error?.message}</FormMessage>}
    </Fragment>
  )
}

FormSelect.displayName = 'FormSelect'

export { FormSelect }
