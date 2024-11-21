import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { HelperText } from 'react-native-paper'

import { IOption } from '@/types/types'

import { Dropdown, DropdownProps } from '../ui/Dropdown'

interface FormSelectProps extends DropdownProps {
  options: IOption[]
  field: string
  icon?: string
  onIconPress?: () => void
  validation?: any
}

export const FormSelect: React.FC<FormSelectProps> = ({ field, validation, options, ...props }) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  return (
    <>
      <Dropdown
        hideMenuHeader
        mode="outlined"
        placeholder="Please select..."
        options={options}
        value={methods.watch(field) || ''}
        onSelect={(value) => methods.setValue(field, value)}
        {...props}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </>
  )
}
