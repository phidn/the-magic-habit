import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { TextStyle, View } from 'react-native'
import { StyleProp } from 'react-native'
import { HelperText, TextInputProps } from 'react-native-paper'
import { DatePickerInput } from 'react-native-paper-dates'

interface InputProps extends TextInputProps {
  field: string
  label: string
  validation?: any
  style?: StyleProp<TextStyle>
  onIconPress?: () => void
}

export const FormDateInput = (props: InputProps) => {
  const { label, field, validation, style } = props

  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const onChange = (value: Date | undefined) => {
    methods.clearErrors(field)
    methods.setValue(field, value)
  }

  const _value = methods.watch(field) || undefined

  return (
    <>
      <View style={[{ marginBottom: 32 }, style]}>
        <DatePickerInput
          locale="vi"
          label={label}
          value={_value}
          onChange={onChange}
          inputMode="start"
          mode="outlined"
        />
      </View>
      {error && <HelperText type="error">{error.message}</HelperText>}
    </>
  )
}
