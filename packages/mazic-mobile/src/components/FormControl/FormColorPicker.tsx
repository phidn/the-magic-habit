import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { StyleProp, View, ViewStyle } from 'react-native'
import { HelperText, IconButton, TextInput } from 'react-native-paper'

import { baseColors } from '@mazic/shared'

import { IOption } from '@/types/types'

import { Dropdown, DropdownProps } from '../ui/Dropdown'

interface FormColorPickerProps extends Omit<DropdownProps, 'options'> {
  field: string
  icon?: string
  onIconPress?: () => void
  validation?: any
  containerStyle?: StyleProp<ViewStyle>
}

export const FormColorPicker = ({ field, validation, containerStyle }: FormColorPickerProps) => {
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  const options: IOption[] = baseColors.map((theme) => {
    return {
      value: theme?.name,
      label: theme?.name,
      inputIcon: <TextInput.Icon icon="checkbox-blank-circle" color={`hsl(${theme?.activeColor.light})`} />,
      dropdownIcon: (
        <IconButton
          icon="checkbox-blank-circle"
          style={{ marginLeft: -4 }}
          iconColor={`hsl(${theme?.activeColor.light})`}
        />
      ),
    }
  })

  return (
    <View style={[{ marginVertical: 4 }, containerStyle]}>
      <Dropdown
        hideMenuHeader
        mode="outlined"
        placeholder="Please select..."
        value={methods.watch(field)}
        onSelect={(value) => methods.setValue(field, value)}
        options={options}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  )
}
