import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Checkbox, HelperText } from 'react-native-paper'

interface ICheckboxProps {
  field: string
  label: string
  validation?: any
}

export const FormCheckbox: React.FC<ICheckboxProps> = ({ label, field, validation, ...props }) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  const _value = !!methods.watch(field)

  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const onChange = () => {
    methods.clearErrors(field)
    methods.setValue(field, !_value)
  }

  return (
    <>
      <Checkbox.Item
        label={label}
        status={_value ? 'checked' : 'unchecked'}
        onPress={onChange}
        style={{ paddingHorizontal: 0, marginLeft: 4, marginRight: -4 }}
        {...props}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </>
  )
}
