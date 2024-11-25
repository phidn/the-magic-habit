import { TextInput } from 'react-native-paper'

import { DropdownInputProps } from './types'

function DropdownInput(props: DropdownInputProps) {
  const { placeholder, label, rightIcon, selectedLabel, mode, disabled, error } = props

  return (
    <TextInput
      placeholder={placeholder}
      label={label}
      value={selectedLabel?.label}
      right={rightIcon}
      mode={mode}
      editable={false}
      disabled={disabled}
      error={error}
      left={selectedLabel?.inputIcon}
    />
  )
}

export default DropdownInput
