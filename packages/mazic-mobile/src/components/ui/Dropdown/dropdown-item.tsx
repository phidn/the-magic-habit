import { useMemo } from 'react'
import { Divider, Menu, useTheme } from 'react-native-paper'

import { DropdownItemProps } from './types'

function DropdownItem(props: DropdownItemProps) {
  const { option, width, value, onSelect, toggleMenu, isLast, menuItemTestID } = props
  const style = useMemo(() => ({ minWidth: width }), [width])
  const theme = useTheme()
  const titleStyle = useMemo(
    () => ({
      color: value === option.value ? theme.colors.primary : theme.colors.onBackground,
      width: width,
    }),
    [option.value, theme.colors.onBackground, theme.colors.primary, value, width],
  )
  const onPress = () => {
    if (option.value) {
      onSelect?.(option.value)
    }
    toggleMenu()
  }

  return (
    <>
      <Menu.Item
        style={style}
        title={option.label}
        titleStyle={titleStyle}
        contentStyle={style}
        onPress={onPress}
        testID={menuItemTestID}
      />
      {!isLast && <Divider />}
    </>
  )
}

export default DropdownItem
