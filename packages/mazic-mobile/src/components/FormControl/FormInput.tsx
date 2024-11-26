import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { TextStyle } from 'react-native'
import { StyleProp } from 'react-native'
import { HelperText, TextInput, TextInputProps } from 'react-native-paper'

interface InputProps extends TextInputProps {
  field: string
  label: string
  icon?: string
  validation?: any
  style?: StyleProp<TextStyle>
  onIconPress?: () => void
}

export const FormInput = (props: InputProps) => {
  const { label, icon, onIconPress, field, validation, style, ...restProps } = props
  const isFormNumber = restProps.inputMode === 'numeric'

  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const onChangeText = (value: string) => {
    methods.clearErrors(field)
    methods.setValue(field, isFormNumber ? +value : value)
  }

  const _value = methods.watch(field) || ''

  return (
    <>
      <TextInput
        label={label}
        value={isFormNumber ? String(_value) : _value}
        onChangeText={onChangeText}
        right={icon && <TextInput.Icon icon={icon} onPress={() => onIconPress?.()} />}
        style={[{ marginVertical: 4 }, style]}
        mode="outlined"
        {...restProps}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </>
  )
}
