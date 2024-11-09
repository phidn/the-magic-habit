import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput, TextInputProps, useTheme } from 'react-native-paper'

interface InputProps extends TextInputProps {
  field: string
  label: string
  icon: string
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
  const theme = useTheme()

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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label={label}
          value={methods.watch(field) || ''}
          onChangeText={onChangeText}
          right={<TextInput.Icon icon={icon} onPress={() => onIconPress?.()} />}
          {...props}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error.message}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontSize: 13,
  },
})
