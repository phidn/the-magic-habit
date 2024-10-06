import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mazic/design-system'

import { IOption } from '@mazic/types/form'

interface FormSelectProps {
  field: string
  options: IOption[]
  onChange?: (value: any) => void
  afterChange?: (value: any) => void
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
  afterChange,
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
    afterChange?.(value)
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
              <div className="flex items-center">
                {opt.icon && <opt.icon className="mr-2 h-4 w-4" />}
                {opt?.label || opt?.renderLabel?.()}
              </div>
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
