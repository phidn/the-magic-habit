import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { HelperText, TextInput, TextInputProps } from 'react-native-paper'

interface InputProps extends TextInputProps {
  field: string
  label: string
  icon?: string
  onIconPress?: () => void
  validation?: any
}

export const FormInput: React.FC<InputProps> = ({
  label,
  icon,
  onIconPress,
  field,
  validation,
  ...props
}) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)
  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const onChangeText = (value: string) => {
    methods.clearErrors(field)
    methods.setValue(field, value)
  }

  return (
    <>
      <TextInput
        label={label}
        value={methods.watch(field) || ''}
        onChangeText={onChangeText}
        right={icon && <TextInput.Icon icon={icon} onPress={() => onIconPress?.()} />}
        style={{ marginVertical: 4 }}
        mode="outlined"
        {...props}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </>
  )
}
