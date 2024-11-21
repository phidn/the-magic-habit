import { Fragment, useCallback, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import { Checkbox, Divider, Menu, useTheme } from 'react-native-paper'

import { MultiSelectDropdownItemProps } from './types'

function MultiSelectDropdownItem(props: MultiSelectDropdownItemProps) {
  const { option, width, value = [], onSelect, isLast, menuItemTestID } = props
  const style = useMemo(() => ({ minWidth: width }), [width])

  const isActive = useCallback(
    (currentValue: any) => {
      return value.indexOf(currentValue) !== -1
    },
    [value],
  )

  const theme = useTheme()
  const titleStyle = {
    color: isActive(option.value) ? theme.colors.primary : theme.colors.onBackground,
  }

  const onPress = () => {
    if (option.value) {
      const valueIndex = value.indexOf(option.value)
      if (valueIndex === -1) {
        onSelect?.([...value, option.value])
      } else {
        onSelect?.([...value].filter((currentValue) => currentValue !== option.value))
      }
    }
  }

  const wrapperStyle: ViewStyle = useMemo(
    () => ({ flexDirection: 'row', alignItems: 'center', paddingRight: 8 }),
    [],
  )
  const menuItemWrapperStyle: ViewStyle = useMemo(() => ({ flex: 1 }), [])

  return (
    <Fragment key={option.value}>
      <View style={wrapperStyle}>
        <View style={menuItemWrapperStyle}>
          <Menu.Item
            testID={menuItemTestID}
            style={style}
            title={option.label}
            titleStyle={titleStyle}
            onPress={onPress}
          />
        </View>
        <Checkbox.Android
          status={isActive(option.value) ? 'checked' : 'unchecked'}
          onPress={onPress}
        />
      </View>

      {!isLast && <Divider />}
    </Fragment>
  )
}

export default MultiSelectDropdownItem
