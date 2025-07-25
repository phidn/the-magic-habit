import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { StyleProp, View, ViewStyle } from 'react-native'
import { HelperText } from 'react-native-paper'

import { IOption } from '@/types/types'

import { Dropdown, DropdownProps } from '../ui/Dropdown'

interface FormSelectProps extends DropdownProps {
  options: IOption[]
  field: string
  icon?: string
  onIconPress?: () => void
  validation?: any
  containerStyle?: StyleProp<ViewStyle>
}

export const FormSelect = (props: FormSelectProps) => {
  const { field, validation, options, containerStyle, ...restProps } = props
  const methods = useFormContext()
  const { error } = methods.getFieldState(field, methods.formState)

  useEffect(() => {
    methods.register(field, validation)
  }, [methods, field, validation])

  return (
    <View style={[{ marginVertical: 4 }, containerStyle]}>
      <Dropdown
        hideMenuHeader
        mode="outlined"
        placeholder="Please select..."
        options={options}
        value={methods.watch(field) || ''}
        onSelect={(value) => methods.setValue(field, value)}
        {...restProps}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  )
}
